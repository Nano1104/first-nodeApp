const { Router } = require("express");

const { authRole } = require("../middleware/auth_role.js");
const { passportCall } = require("../utils/passportcall.js");

//TRAEMOS EL PRODUCT MANAGER PARA HACER USO DE SUS METODOS Y TRABAJAR CON LOS PRODUCTS DEL JSON
const CartsController = require("../controllers/carts.controller.js");

class CartsRouter {
    path = '/carts';
    router = Router();
    cartsController = new CartsController()
    
    constructor() {
        this.initCartsRoutes();
    }

    initCartsRoutes() {
        //////////////////////////////// GET CARTS
        this.router.get(`${this.path}`, this.cartsController.getCarts)

        //////////////////////////////// GET CART PRODUCTS
        this.router.get(`${this.path}/:cid`, this.cartsController.getCartProducts)

        //////////////////////////////// POST CART
        this.router.post(`${this.path}`, this.cartsController.creatCart)
        
        //////////////////////////////// POST PRODUCT IN CERTAIN CART
        this.router.post(`${this.path}/:cid/products/:pid`,  [passportCall('jwt'), authRole('user', 'premium')], this.cartsController.postProductInCart)

        //////////////////////////////// DELETE PRODUCT (pid) FROM CART (cid)
        this.router.delete(`${this.path}/:cid/products/:pid`, this.cartsController.deleteProductFromCart)

        //////////////////////////////// DELETE ALL PRODUCTS FROM CART (cid)
        this.router.delete(`${this.path}/:cid`, this.cartsController.deleteProductsFromCart)

        //////////////////////////////// UPDATE PRODUCTS IN CART (cid)
        this.router.put(`${this.path}/:cid`, this.cartsController.putProductsInCart)

        //////////////////////////////// UPDATE PRODUCT QUANTITY (pid) IN CART (pid)
        this.router.put(`${this.path}/:cid/products/:pid`, this.cartsController.updateProdQuantityInCart)

        //////////////////////////////// FINISH CART PURCHASE
        this.router.post(`${this.path}/:cid/purchase`, [passportCall('jwt'), authRole('user', 'premium')], this.cartsController.finishPurchase)
    }
}

module.exports = CartsRouter



