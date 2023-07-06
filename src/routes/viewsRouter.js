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
            res.render('products', {products});
            //otra opcion
            /* res.render('products', {products: products}); */
        })

        this.router.get(`${this.path}/carts/:cid`, async (req, res) => {
            const { cid } = req.params
            const cartProds = await this.cartManager.getCartProducts(cid)
            res.render("cartView", {cartProds});
        })

        this.router.get(`${this.path}/chat`, async (req, res) => {
            res.render("chat");
        })

        this.router.get(`${this.path}/realtimeproducts`, async (req, res) => {
            res.render("realTimeProducts");
        })

    }
}

module.exports = ViewsRouter;