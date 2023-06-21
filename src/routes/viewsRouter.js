const { Router } = require('express');

//TRAEMOS EL PRODUCT MANAGER PARA HACER USO DE SUS METODOS
const ProductsManager = require("../dao/managers/products.manager.js");
const MessagesManager = require("../dao/managers/messages.manager.js");

class ViewsRouter {
    path = "/views";
    router = Router();
    prodManager = new ProductsManager();

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.router.get(`${this.path}/home`, async (req, res) => {
            const products = await this.prodManager.getProducts();
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