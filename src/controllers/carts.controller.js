const CartsManager = require("../dao/managers/carts.manager.js");

class CartsController {
    cartsService;
    constructor() {
        this.cartsService = new CartsManager();
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
            res.status(200).json({message: `Success getting products from cart: ${req.params.cid}`, cartProds: cartProds})
        } catch (err) {
            res.status(400).json({message: `Error getting products from cart: ${req.params.cid}`, err: err})
        }
    }

    creatCart = async (req, res) => {
        try {
            await this.cartsService.creatCart()
            res.status(200).json({message: "Cart created successfully"})
        } catch (err) {
            res.status(400).json({message: "Erro creating cart", err: err})
        }
    }

    postProductInCart = async (req, res) => {
        const cartId = req.params.cid
        const prodId = req.params.pid
        try {
            await this.cartsService.postProductInCart(cartId, prodId)
            const cartModified = await this.cartsService.getCartById(cartId)
            res.status(200).json({message: `Product added successfully in cart: ${cartId}`, cartModified})
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
            await this.cartsService.deleteProductsFromCart(cartId) 
            res.status(200).json({message: `Products deleted successfully from cart ${cartId}`})
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
        const cartId = req.params.cid
        const prodId = req.params.pid
        const newQuantity = req.body
        try {
            await this.manager.putProductInCart(cartId, prodId, newQuantity)
            res.status(200).json({message: `Product: ${prodId} updated successfully in cart: ${cartId}`})
        } catch (err) {
            res.status(400).json({message: `Error updating product quantity in cart: ${cartId}`, err: err})
        }
    }
}

module.exports = CartsController;