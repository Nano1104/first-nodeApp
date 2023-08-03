const passport = require('passport');
const { Router } = require("express");
const { createHash, isValidPassword } = require("../utils/encrypt.js");

const { generateToken } = require("../utils/jwt.js");
const { authToken } = require("../middleware/auth_token.js");

const userModel = require("../dao/models/userModel");
const ProductsManager = require("../dao/managers/products.manager.js");     //traemos el products manager para hacer uso de los mismos

class SessionRouter {
    path = "/session";
    router = Router();
    prodManager = new ProductsManager();

    constructor() {
        this.initProdsRoutes();
    }

    initProdsRoutes() {
        this.router.get(`${this.path}/logout`, async (req, res) => {
            req.session.destroy(err => {
                if(!err) res.render("login")       //redirige a la vista de login para iniciar session nuevamente luego de haberla cerrado
                else res.send({status: 401, body: err})
            })
        })

        this.router.post(`${this.path}/login`, passport.authenticate('login', { failureRedirect: `/api${this.path}/faillogin` }), async (req, res) => {
            const products = await this.prodManager.getProducts();
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
        }) 


        this.router.post(`${this.path}/register`, passport.authenticate('register', {failureRedirect: `/api${this.path}/failregister`}), async (req, res) => {
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
        })

        this.router.get(`${this.path}/github`, passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {
            console.log("Entering github")
        })

        this.router.get(`${this.path}/github/callback`, passport.authenticate('github', {failureRedirect: `/api${this.path}/login`}), async (req, res) => {
            try {
                req.session.user = req.user
                res.redirect(`/api${this.path}/private`)
            } catch (err) {
                res.status(500).json({message: "Error login with github", error: err})
            }
        })

        this.router.get(`${this.path}/login`, (req, res) => {
            res.render("login");
        })

        this.router.get(`${this.path}/faillogin`, (req, res) => {
            res.render("faillogin");
        })
        
        this.router.get(`${this.path}/failregister`, (req, res) => {
            res.render("failregister");
        })

        this.router.get(`${this.path}/private`, async(req, res) => {
            const decodedToken = req.user
            const token = req.token
            res.render("private", { token, decodedToken })
           /*  res.json({ token, decodedToken }) */
        })
    }
}

module.exports = SessionRouter;