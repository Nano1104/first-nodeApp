const fs = require('fs');
const { Router } = require("express");

//TRAEMOS EL PRODUCT MANAGER PARA HACER USO DE SUS METODOS Y TRABAJAR CON LOS PRODUCTS DEL JSON
const CartsManager = require("../dao/managers/carts.manager.js");


class CartsRouter {
    path = '/carts';
    JSONpath = 'carrito.json';
    router = Router();
    manager = new CartsManager();

    constructor() {
        this.initCartsRoutes();
    }

    initCartsRoutes() {
        const getCarts = async (req, res) => {      //funcion para traer el carrito json en caso de que no este vacio
            if(fs.existsSync(JSONpath)) {
                const data = await fs.promises.readFile(JSONpath, 'utf8');
                const carts = JSON.parse(data)
                return carts
            } else {
                return []
            }
        }

        //////////////////////////////// GET CARTS
        this.router.get(`${this.path}`, async (req, res,) => {
            try {
                let carts = await this.manager.getCarts()
                res.send({status: 200, message: "successfully requeste", carts})
            } catch(err) {
                res.send({status: 400, message: "error getting cars", err})
            }
        })

        //////////////////////////////// GET CART PRODUCTS
        this.router.get(`${this.path}/:cid`, async (req, res) => {
            /* const carts = await getCarts()
            const cartFound = carts.find(cart => cart.id === Number(req.params.cid))    //encontramos el cart del id pasado por param
            res.json(cartFound.products) */
            try {
                let cartProds = await this.manager.getCartProducts(req.params.cid)
                res.send({status: 200, "message": "requested cart products found", cartProds})
            } catch(err) {
                res.send({status: 400, message: `Error getting products from cart: ${req.params.cid}`, err})
            }
        })

        //////////////////////////////// POST CART
        this.router.post(`${this.path}`, async (req, res) => {
            try {
                await this.manager.creatCart()
                res.send({status: 200, "message": "Cart created successfully"})
            } catch(err) {
                res.send({status: 400, message: `Error posting cart`, err})
            }
            /* const carts = await getCarts(); */
            /* carts.length === 0 ? newCart.id = 1 : newCart.id = carts[carts.length - 1].id + 1; //se crea el id de manera autoincramental */

            /* carts.push(newCart);
            await fs.promises.writeFile(path, JSON.stringify(carts, null, '\t'))
            res.send({status: 200, message: "New Cart Added"}) */
        })

        //////////////////////////////// POST PRODUCT IN CERTAIN CART
        this.router.post(`${this.path}/:cid/product/:pid`, async (req, res) => {
            const cartId = req.params.cid
            const prodId = req.params.pid

            try {
                await this.manager.postProductInCart(cartId, prodId)
                const cartModified = await this.manager.getCartById(cartId)
                res.send({status: 200, message: `Product added successfully in cart: ${cartId}`, cartModified})
            } catch(err) {
                res.send({status: 400, message: `Error posting product in cart: ${cartId}`, err})
            }
        })
    }
}

module.exports = CartsRouter



/* this.router.post(`${this.path}/:cid/product/:pid`, async (req, res) => {
    const carts = await getCarts()
    const prods = await this.manager.getProducts()
    const cartId = Number(req.params.cid)
    const prodId = Number(req.params.pid)

    const cartFound = carts.find(cart => cart.id === cartId)
    const prodToAdd = await prods.find(prod => prod.id === prodId)       //vemos si existe el product que se quiere agregar

    if(prodToAdd) {     // si existe el product con el id pasado por param se agregara o sumara el qunatity
        
        if(cartFound.products.findIndex(prod => prod.product === prodId) > -1) {       //si ya existe el product que se quiere agregar solo aumenta la cantida 
            const index = cartFound.products.findIndex(prod => prod.product === prodId)      //obtenemos el index del objeto del products a modificar
            cartFound.products[index].quantity += 1
            await fs.promises.writeFile(path, JSON.stringify(carts, null, '\t'))       //rescribimos el archivo json para ajustar los cambios
    
        } else {
            console.log(cartFound.products.findIndex(prod => prod.id === prodId))
            cartFound.products.push({
                "product": prodId,
                "quantity": 1
            })
            await fs.promises.writeFile(path, JSON.stringify(carts, null, '\t'))        //rescribimos el archivo json para ajustar los cambios
        }
        res.json(cartFound.products)

    } else {        //en caso de que no exista el product con el id pasado por param en el products.json se enviara el siguiente mensaje
        res.send({status: 400, message: "Does not exist product with that Id"})
    }

}) */


