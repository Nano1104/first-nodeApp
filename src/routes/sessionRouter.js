const { Router } = require("express");

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
                if(!err) res.redirect("/api/views/login")       //redirige a la vista de login para iniciar session nuevamente luego de haberla cerrado
                else res.send({status: 401, body: err})
            })
        })

        this.router.post(`${this.path}/login`, async (req, res) => {
            const products = await this.prodManager.getProducts();
            try {
                const { email, password } = req.body; 
                const findUser = await userModel.findOne({ email })

                if(!findUser) return res.status(401).json({message: "User not found"})    //valida si el user ya existe    
                if(findUser.password.toString() !== password) return res.status(401).json({message: "password incorrect"})        //o si la contraseña es incorrecta     
                
                req.session.user = {
                    ...findUser,
                    password: ''
                }
                
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
                res.send({status: 401, body: err})
            }
        })

        this.router.post(`${this.path}/register`, async (req, res) => {
            try {
                let role;
                const body = req.body
                const { email, password } = body

                if(email === 'adminCoder@code.com' && password === 'adminCoder3r123') {        //valida si el email y el pswrd son del admin
                    role = "admin"
                    req.session.user = { ...body, role: role }
                } else {                                                                       //sino establece que es un usuario
                    role = "usuario"
                    req.session.user = { ...body, role: role } 
                }

                await userModel.create({...body, role: role})
                res.redirect("/api/views/login")                //redirige al login luego de haberse registrado
            } catch (err) {
                res.send({status: 500, message: "Error creating user", err})
            }
        })
    }
}

module.exports = SessionRouter;