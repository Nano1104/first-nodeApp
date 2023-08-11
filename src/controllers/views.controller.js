
const ProductsService = require('../services/products.service.js');
const CartsService = require('../services/carts.service.js');

class ViewsController {
    productsService = new ProductsService();
    cartsService = new CartsService();

    renderProducts = async(req, res) => {
        try {
            const products = await this.productsService.getProducts();
            res.render("products", {products});
        } catch (err) {
            res.status(500).json({message: "Error rendering products"})
        }
    }

    renderCart = async(req, res) => {
        try {
            const cartProds = await this.cartsService.getCartProducts(req.params.cid)
            res.render("cartProds", {cartProds});
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
            const data = {
                user: req.session.user.first_name || "mariano",
                edad: req.session.user.age || 19
            }
            res.render("private", data);
        } catch (err) {
            res.json(500).json({message: "Error rendering private user"})
        }
    }

    renderLogin = async(req, res) => {
        res.render("login");
    }

    renderRegister = async(req, res) => {
        res.render("register");
    }
}

module.exports = ViewsController;