const { ProductsServiceDao, CartsServiceDao } = require('../services/index.js');;

class ViewsController {
    constructor() {
        this.productsService = ProductsServiceDao;
        this.cartsService = CartsServiceDao
    }

    renderProducts = async(req, res) => {
        try {
            const products = await this.productsService.getProducts();
            const cart = req.user.user.cart  //manda el cart del user logueado
            res.render("products", { products, cart });
        } catch (err) {
            res.status(500).json({message: "Error rendering products"})
        }
    }

    renderCart = async(req, res) => {
        try {
            const cartId = req.params.cid
            const cartProds = await this.cartsService.getCartProducts(cartId)
            res.render("cartProds", {cartId, cartProds});
        } catch (err) {
            res.status(500).json({message: `Error rendering products from cart: ${req.params.cid}`})
        }
    }

    renderChat = async(req, res) => {
        res.render("chat");
    }

    renderRealTimeProducts = async(req, res) => {
        res.render("realTimeProducts");
    }

    renderPrivate = async(req, res) => {
        try {
            /* const data = {
                user: req.session.user.first_name || "mariano",
                edad: req.session.user.age || 19
            }
            res.render("private", data); */
            const user = req.user.user
            res.render("private", {user})
        } catch (err) {
            res.json(500).json({message: "Error rendering private user"})
        }
    }

    renderLogin = async(req, res) => {
        if(!req.cookies.userToken) {        //en caso de que ya exista un token, redirige a la vista principal
            res.render("login");
        } else {
            res.redirect("/api/views/private")
        }
    }

    renderRegister = async(req, res) => {
        res.render("register");
    }
}

module.exports = ViewsController;