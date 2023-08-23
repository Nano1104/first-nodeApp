const { Router } = require("express");

//TRAEMOS EL PRODUCT MANAGER PARA HACER USO DE SUS METODOS
const ProductsController = require("../controllers/products.controller.js");

class ProdsRouter {
    path = "/products";
    router = Router();
    prodsController = new ProductsController();

    constructor() {
        this.initProdsRoutes();
    }

    initProdsRoutes() {
        
        //////////////////////////////// GET PRODUCTS
        this.router.get(`${this.path}`, this.prodsController.getProducts)

        //////////////////////////////// GET BY ID
        this.router.get(`${this.path}/:pid`, this.prodsController.getProductById)

        //////////////////////////////// ADD PRODUCT
        this.router.post(`${this.path}`, this.prodsController.createProduct) 

        //////////////////////////////// UPDATE PRODUCT
        this.router.put(`${this.path}/:pid`, this.prodsController.updateProduct)

        //////////////////////////////// DELETE PRODUCT
        this.router.delete(`${this.path}/:pid`, this.prodsController.deleteProduct)

    }
}

module.exports = ProdsRouter;


