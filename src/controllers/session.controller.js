const { isValidPassword, createHash } = require("../utils/encrypt.js");
const { generateToken } = require("../utils/jwt.js");

const userModel = require("../models/userModel.js");

class SessionController {
    ////////////////////////////////////// LOGIN
    sessionLogin = async(req, res) => {
        try {
            const { email, password } = req.body; 
            const findUser = await userModel.findOne({ email })

            if(!findUser) return res.status(401).json({message: "User not found"})    //valida si el user ya existe    
            if(!isValidPassword(findUser, password)) return res.status(401).json({message: "password incorrect"})        //o si la contraseña es incorrecta     
            
            const token = generateToken(findUser)
            console.log(token)
            res.cookie('userToken', token, { httpOnly: true });

            res.json({message: "Token generado", token})
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    ////////////////////////////////////// REGISTER
    sessionRegister = async(req, res) => {
        try {
            const { email, password, role } = req.body;
            if(!email) throw 'Error validation failed'
            
            const userToAdd = {
                ...req.body,
                password: createHash(password)
            }

            if(!role) userToAdd.role = "public"

            await userModel.create(userToAdd)
            res.render("login")                //redirige al login luego de haberse registrado
        } catch (err) {
            res.render("failregister"); 
        }
    }

    ////////////////////////////////////// GITHUB
    sessionGithub = async (req, res) => {
        try {
            req.session.user = req.user
            res.redirect("/api/session/private")
        } catch (err) {
            res.status(500).json({message: "Error login with github", error: err})
        }
    }

    renderLogin = async(req, res) => {
        res.render("login");
    }

    renderFailLogin = async(req, res) => {
        res.render("faillogin")
    }

    renderFailRegister = async(req, res) => {
        res.render("failregister")
    }

    renderPrivate = async(req, res) => {
        const decodedToken = req.user
        const token = req.token
        res.render("private", { token, decodedToken })
    }
}

module.exports = SessionController;