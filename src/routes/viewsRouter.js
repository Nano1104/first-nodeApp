const { Router } = require('express');

//TRAEMOS EL PRODUCT MANAGER PARA HACER USO DE SUS METODOS
const ProductsManager = require("../dao/managers/products.manager.js");
const CartsManager = require("../dao/managers/carts.manager.js");

class ViewsRouter {
    path = "/views";
    router = Router();
    prodManager = new ProductsManager();
    cartManager = new CartsManager();

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.router.get(`${this.path}/products`, async (req, res) => {
            const products = await this.prodManager.getProducts();
            /* const user = req.session.user; */
            res.render("products", {products});
        })

        this.router.get(`${this.path}/carts/:cid`, async (req, res) => {
            const { cid } = req.params
            const cartProds = await this.cartManager.getCartProducts(cid)
            res.render("cartProds", {cartProds});
        })

        this.router.get(`${this.path}/chat`, async (req, res) => {
            res.render("chat");
        })

        this.router.get(`${this.path}/realtimeproducts`, async (req, res) => {
            res.render("realTimeProducts");
        })

        //////////////////////////////// SESSION VIEWS 
        this.router.get(`${this.path}/login`, async (req, res) => {
            res.render("login");
        })

        this.router.get(`${this.path}/register`, async (req, res) => {
            res.render("register");
        })

        /* this.router.get(`${this.path}/faillogin`, async (req, res) => {
            
        })

        this.router.get(`${this.path}/failregister`, async (req, res) => {
            
        }) */
    }
}

module.exports = ViewsRouter;