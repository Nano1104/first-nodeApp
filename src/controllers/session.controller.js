const { createHash, isValidPassword } = require("../utils/encrypt.js");
const { generateToken } = require("../utils/jwt.js");
const { authToken } = require("../middleware/auth_token.js");

const ProductsService = require("../services/products.service.js");  
const userModel = require("../models/userModel.js");

class SessionController {
    productsService = new ProductsService();

    sessionLogout = async(req, res) => {
        req.session.destroy(err => {
            if(!err) res.render("login")       //redirige a la vista de login para iniciar session nuevamente luego de haberla cerrado
            else res.send({status: 401, body: err})
        })
    }

    sessionLogin = async(req, res) => {
        const products = await this.productsService.getProducts();
        try {
            const { email, password } = req.body; 
            const findUser = await userModel.findOne({ email })

            if(!findUser) return res.status(401).json({message: "User not found"})    //valida si el user ya existe    
            if(!isValidPassword(findUser, password)) return res.status(401).json({message: "password incorrect"})        //o si la contraseña es incorrecta     
            
            const token = generateToken(findUser)

            req.session.user = {
                ...findUser,
                password: ''
            }
            
            res.cookie('token', token, { httpOnly: true });

            res.render("products", {
                first_name: req.session.user._doc.first_name,
                last_name: req.session.user._doc.last_name,
                email: req.session.user._doc.email,  
                age: req.session.user._doc.age,
                phone: req.session.user._doc.phone,
                role: req.session.user._doc.role,
                products                                        //manda el array de products de la db de mongo que obtuvimos arriba
            })
        } catch (err) {
            res.status(500).json({ message: "Internal Server Error", error: err });
        }
    }

    sessionRegister = async(req, res) => {
        try {
            const body = req.body;
            const { email } = req.body;
            if(!email) throw 'Error validation failed'

            const userToAdd = { ...body, email }

            req.session.user = { ...userToAdd };
            res.render("login")                //redirige al login luego de haberse registrado
        } catch (err) {
            res.render("failregister"); 
        }
    }

    sessionGithub = async(req, res) => {
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