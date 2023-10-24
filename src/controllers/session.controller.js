const { isValidPassword, createHash } = require("../utils/encrypt.js");
const { generateToken } = require("../utils/jwt.js");

const { NODE_ENV } = require("../config/config.js");

const userModel = require("../models/userModel.js");
const cartsModel = require("../models/carts.model.js");

class SessionController {
    ////////////////////////////////////// LOGOUT
    sessionLogout = async (req, res) => {
        try {
            const currentUserId = req.user.user._id
            await userModel.findByIdAndUpdate(currentUserId, { last_connection: new Date() })
            res.clearCookie('userToken')
            res.redirect('/api/views/login')
        } catch (err) {
            res.status(400).json({ message: "Error logout", error: err })
        }
    }

    ////////////////////////////////////// LOGIN
    sessionLogin = async (req, res) => {
        try {
            const { email, password } = req.body; 
            const findUser = await userModel.findOne({ email })

            if(!findUser) return res.status(404).json({message: "User not found"})    //valida si el user ya existe    
            if(!isValidPassword(password, findUser)) return res.status(401).json({message: "password incorrect"})        //o si la contraseña es incorrecta     
            
            await userModel.findByIdAndUpdate(findUser._id, { last_connection: new Date() })    //cada vez que el user inicie session se le actualiza su prop
            const token = generateToken(findUser)
            res.cookie('userToken', token, { httpOnly: true });
            req.user = findUser                                 //pase el user logueado por el objeto req

            if(NODE_ENV == "production" || NODE_ENV == "preProduction") {
                res.redirect("/api/views/products")
            } else {
                res.status(200).json({message: "User login successfully with Token", token: token})
            }
        } catch (err) {
            if(NODE_ENV == "production" || NODE_ENV == "preProduction") {
                res.render('faillogin')
            } else {
                req.logger.error(`Error login user - URL: ${req.url}`)
                res.status(500).json({ message: "Error login User", error: err });
            }
        }
    }

    ////////////////////////////////////// REGISTER
    sessionRegister = async (req, res) => {
        try {
            const { email, password, role } = req.body;
            const userToAdd = {
                ...req.body,
                password: createHash(password)
            }

            const findUser = await userModel.findOne({ email })     
            if(findUser) return res.status(409).json({message: "User already exists"}) //en caso de que ya exista el user en la db

            if(!role) userToAdd.role = "user"
            // si cumple con los campos se le asigna el role de admin
            if(email == "appadmin@hotmail.com" && password == '12345') userToAdd.role = "admin" 
            
            const newCart = { //se crea el cart que tendra asociado el user
                products: []
            }
            const userCart = await cartsModel.create({ ...newCart })
            userToAdd.cart = userCart   //agregamos el cart creado al user
            
            const user = await userModel.create({ ...userToAdd })
            
            if(NODE_ENV == "production" || NODE_ENV == "preProduction") {
                res.render("login")
            } else {
                res.status(200).json({ message: "Successful register", user })
            }
        } catch (err) {
            if(NODE_ENV == "production" || NODE_ENV == "preProduction") {
                res.render('failregister')
            } else {
                req.logger.error(`Error registering user - URL: ${req.url}`)
                res.status(500).json({ message: "Registration failed", error: err });
            }
        }
    }

    renderFailLogin = async(req, res) => {
        res.render("faillogin")
    }

    renderFailRegister = async(req, res) => {
        res.render("failregister")
    }
}

module.exports = SessionController;