const { Router } = require("express");
const { authRole } = require("../middleware/auth_role.js")
const { passportCall } = require("../utils/passportcall.js");

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
        this.router.post(`${this.path}`, [passportCall('jwt'), authRole('user')], this.prodsController.createProduct) 

        //////////////////////////////// UPDATE PRODUCT
        this.router.put(`${this.path}/:pid`, [passportCall('jwt'), authRole('admin')], this.prodsController.updateProduct)

        //////////////////////////////// DELETE PRODUCT
        this.router.delete(`${this.path}/:pid`, [passportCall('jwt'), authRole('admin')], this.prodsController.deleteProduct)

    }
}

module.exports = ProdsRouter;


