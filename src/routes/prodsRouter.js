const { Router } = require("express");
const { authRole } = require("../middleware/auth_role.js")

//TRAEMOS EL PRODUCT MANAGER PARA HACER USO DE SUS METODOS
const ProductsController = require("../controllers/products.controller.js");

class ProdsRouter {
    constructor() {
        this.path = "/products";
        this.router = Router();
        this.prodsController = new ProductsController();
        this.initProdsRoutes();
    }

    initProdsRoutes() {
        
        //////////////////////////////// GET PRODUCTS
        this.router.get(`${this.path}`, this.prodsController.getProducts)

        //////////////////////////////// GET BY ID
        this.router.get(`${this.path}/:pid`, this.prodsController.getProductById)

        //////////////////////////////// ADD PRODUCT
        this.router.post(`${this.path}`, authRole('user'), this.prodsController.createProduct) 

        //////////////////////////////// UPDATE PRODUCT
        this.router.put(`${this.path}/:pid`, authRole('admin'), this.prodsController.updateProduct)

        //////////////////////////////// DELETE PRODUCT
        this.router.delete(`${this.path}/:pid`, authRole('admin'), this.prodsController.deleteProduct)

    }
}

module.exports = ProdsRouter;


