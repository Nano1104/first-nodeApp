const { Router } = require('express');

//TRAEMOS EL PRODUCT MANAGER PARA HACER USO DE SUS METODOS
const ProductsManager = require("../dao/managers/products.manager.js");

class ViewsRouter {
    path = "/views";
    router = Router();
    manager = new ProductsManager();

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.router.get(`${this.path}/home`, async (req, res) => {
            const products = await this.manager.getProducts();
            res.render("home", {products});
        })

        this.router.get(`${this.path}/chat`, async (req, res) => {
            res.render("chat")
        })

        this.router.get(`${this.path}/realtimeproducts`, async (req, res) => {
            res.render("realTimeProducts");
        })
    }
}

module.exports = ViewsRouter;