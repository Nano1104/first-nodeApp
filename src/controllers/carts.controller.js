const { CartsServiceDao } = require("../services/index.js");
const { NODE_ENV } = require("../config/config.js");

class CartsController {
    cartsService;
    constructor() {
        this.cartsService = CartsServiceDao;
    }

    getCarts = async (req, res) => {
        try {
            const carts = await this.cartsService.getCarts()
            res.status(200).json({message: "Success getting carts", carts: carts})
        } catch (err) {
            res.status(400).json({message: "Error getting carts", err: err})
        }
    }
    
    getCartProducts = async (req, res) => {
        try {
            let cartProds = await this.cartsService.getCartProducts(req.params.cid)
            /* if(NODE_ENV == "development") {
                res.status(200).json({message: `Success getting products from cart: ${req.params.cid}`, cartProds: cartProds})
            } else {
                res.redirect(`/api/views/carts/${req.params.cid}`)
            } */
            res.redirect(`/api/views/carts/${req.params.cid}`)
        } catch (err) {
            res.status(400).json({message: `Error getting products from cart: ${req.params.cid}`, err: err})
        }
    }

    creatCart = async (req, res) => {
        try {
            const cart = await this.cartsService.creatCart()
            res.status(200).json({message: "Cart created successfully", newCart: cart})
        } catch (err) {
            res.status(400).json({message: "Error creating cart", err: err})
        }
    }

    postProductInCart = async (req, res) => {
        const cartId = req.params.cid
        const prodId = req.params.pid
        try {
            await this.cartsService.postProductInCart(cartId, prodId)
            const cartModified = await this.cartsService.getCartById(cartId)
            res.status(200).json({message: `Product added successfully in cart: ${cartId}`, cart: cartModified})
        } catch (err) {
            res.status(400).json({message: `Error posting product in cart: ${cartId}`, err: err})
        }
    }

    deleteProductFromCart = async (req, res) => {
        const cartId = req.params.cid
        const prodId = req.params.pid
        try {
            await this.cartsService.deleteProductFromCart(cartId, prodId)
            res.status(200).json({message: `Product: ${prodId} deleted from cart ${cartId}`})
        } catch (err) {
            res.status(400).json({message: `Error deleting prod ${prodId} from cart: ${cartId}`, err: err})
        }
    }

    deleteProductsFromCart = async (req, res) => {
        const cartId = req.params.cid
        try {
            const cart = await this.cartsService.deleteProductsFromCart(cartId) 
            res.status(200).json({message: `Products deleted successfully from cart ${cartId}`, result: cart})
        } catch (err) {
            res.status(400).json({message: `Error deleting prods from cart: ${cartId}`, err: err})
        }
    }

    putProductsInCart = async (req, res) => {
        const cartId = req.params.cid 
        const { products } = req.body
        try {
            await this.cartsService.putProductsInCart(cartId, products)
            res.status(200).json({message:`Products updated successfully in cart ${cartId}`})
        } catch (err) {
            res.status(400).json({message: `Error updating prods in cart: ${cartId}`, err: err})
        }
    }

    updateProdQuantityInCart = async (req, res) => {
        const cartId = req.params.cid;
        const prodId = req.params.pid;
        const newQuantity = req.body;
        try {
            await this.cartsService.updateProdQuantityInCart(cartId, prodId, newQuantity)
            res.status(200).json({message: `Product: ${prodId} updated successfully in cart: ${cartId}`})
        } catch (err) {
            res.status(400).json({message: `Error updating product quantity in cart: ${cartId}`, err: err})
        }
    }

    finishPurchase = async (req, res) => {
        try {
            await this.cartsService.finishPurchase(req.params.cid, req.user.user)    //pasamos el id del cart y el user de la session para usar su email en el ticket
            res.status(200).json({message: `Purchase finished successfully`})
        } catch (err) {
            res.status(400).json({message: `Error finishing purchase`})
        }
    }
}

module.exports = CartsController;