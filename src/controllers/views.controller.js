const { ProductsServiceDao, CartsServiceDao } = require('../services/index.js');
const userModel = require("../models/userModel.js");
const UserDto = require("../dto/user.dto.js");

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

    renderDeleteProducts = async (req, res) => {
        try {
            const products = await this.productsService.getProducts();
            res.render("deleteProducts", { products })
        } catch (err) {
            res.status(500).json({message: `Error rendering deleting products view`})
        }
    }

    renderChat = async(req, res) => {
        res.render("chat");
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

    renderAdminManagement = async(req, res) => {
        const users = await userModel.find({}).lean()
        const usersDTO = users.map(user => new UserDto(user))
        const usersDTOwithNotAdmin = usersDTO.filter(user => user.role !== 'admin')   //envia todos los users pasados por el DTO pero sin aquellos que sean admin
        res.render("adminUserManagement", {usersDTOwithNotAdmin})
    }
}

module.exports = ViewsController;