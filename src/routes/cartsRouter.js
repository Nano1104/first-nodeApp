const fs = require('fs');
const { Router } = require("express");

//TRAEMOS EL PRODUCT MANAGER PARA HACER USO DE SUS METODOS Y TRABAJAR CON LOS PRODUCTS DEL JSON
const ProductManager = require('../prodManager.js');                //este es el prodManager de Filesytem
const CartsManager = require("../dao/managers/carts.manager.js");


class CartsRouter {
    path = '/carts';
    JSONpath = 'carts.json';
    router = Router();
    manager = new CartsManager();
    prodManager = new ProductManager();

    constructor() {
        this.initCartsRoutes();
    }

    initCartsRoutes() {
        const getCarts = async (req, res) => {      //funcion para traer el carrito json en caso de que no este vacio
            if(fs.existsSync(this.JSONpath)) {
                const data = await fs.promises.readFile(this.JSONpath, 'utf8');
                const carts = JSON.parse(data)
                return carts
            } else {
                return []
            }
        }

        //////////////////////////////// GET CARTS
        this.router.get(`${this.path}`, async (req, res,) => {
            //GET CARTS MONGO
            try {
                let carts = await this.manager.getCarts()
                res.send({status: 200, message: "successfully request", carts})
            } catch(err) {
                res.send({status: 400, message: "error getting carts", err})
            }

            //GET CARTS Filesystem
            return await getCarts()
        })

        //////////////////////////////// GET CART PRODUCTS
        this.router.get(`${this.path}/:cid`, async (req, res) => {
            //GET CART PRODUCTS Mongo
            try {
                let cartProds = await this.manager.getCartProducts(req.params.cid)
                res.send({status: 200, "message": "requested cart products found", cartProds})
            } catch(err) {
                res.send({status: 400, message: `Error getting products from cart: ${req.params.cid}`, err})
            }

            //GET CART PRODUCTS Filesystem
            /* const carts = await getCarts()
            const cartFound = carts.find(cart => cart.id === Number(req.params.cid))
            return cartFound.products */
        })

        //////////////////////////////// POST CART
        this.router.post(`${this.path}`, async (req, res) => {
            //POST CART Mongo
            try {
                await this.manager.creatCart()
                res.send({status: 200, "message": "Cart created successfully"})
            } catch(err) {
                res.send({status: 400, message: `Error posting cart`, err})
            }

            //POST CART Filesystem
            /* const carts = await getCarts();
            const newCart = { products: [] }
            carts.length === 0 ? newCart.id = 1 : newCart.id = carts[carts.length - 1].id + 1; //se crea el id de manera autoincramental

            carts.push(newCart);
            await fs.promises.writeFile(this.JSONpath, JSON.stringify(carts, null, '\t')) */
        })

        //////////////////////////////// POST PRODUCT IN CERTAIN CART
        /************************************  POST PRODUCT IN CART Mongo  ***************************** */
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

            /************************************  POST PRODUCT IN CART Filesystem  ***************************** */
            /* const carts = await getCarts()
            const prods = await this.prodManager.getProducts()

            const cartFound = carts.find(cart => cart.id === Number(cartId))
            const prodToAdd = await prods.find(prod => prod.id === Number(prodId))       //vemos si existe el product que se quiere agregar

            if(prodToAdd) {     // si existe el product con el id pasado por param se agregara o sumara el qunatity
                
                if(cartFound.products.findIndex(prod => prod.product === prodId) > -1) {       //si ya existe el product que se quiere agregar solo aumenta la cantida 
                    const index = cartFound.products.findIndex(prod => prod.product === prodId)      //obtenemos el index del objeto del products a modificar
                    cartFound.products[index].quantity += 1
                    await fs.promises.writeFile(this.JSONpath, JSON.stringify(carts, null, '\t'))       //rescribimos el archivo json para ajustar los cambios
            
                } else {
                    console.log(cartFound.products.findIndex(prod => prod.id === prodId))
                    cartFound.products.push({
                        "product": prodId,
                        "quantity": 1
                    })
                    await fs.promises.writeFile(this.JSONpath, JSON.stringify(carts, null, '\t'))        //rescribimos el archivo json para ajustar los cambios
                }
                res.json(cartFound.products)

            } else {                                    //en caso de que no exista el product con el id pasado por param en el products.json se enviara el siguiente mensaje
                res.send({status: 400, message: "Does not exist product with that Id"})
            } */

        })

        //////////////////////////////// DELETE PRODUCT (pid) FROM CART (cid)
        this.router.delete(`${this.path}/:cid/products/:pid`, async (req, res) => {
            const cartId = req.params.cid
            const prodId = req.params.pid
            
            try {
                await this.manager.deleteProductFromCart(cartId, prodId)
                res.json({status: 200, message: `Product ${prodId} deleted from cart ${cartId}`})
            } catch (err) {
                res.json({status: 400, message: "Error deleting prod from cart", err})
            }
        })

        //////////////////////////////// UPDATE PRODUCTS IN CART (cid)
        this.router.put(`${this.path}/:cid`, async (req, res) => {
            const cartId = req.params.cid 
            const newProducts = req.body            //toma el json del body
            const { products } = newProducts        //toma la propiedad products del json (body)
            try {
                await this.manager.putProductsInCart(cartId, products)
                res.json({status: 200, message: `Products added successfully in cart ${cartId}`})
            } catch (err) {
                res.json({status: 400, message: "Error adding new products array", err})
            }
        })

        //////////////////////////////// UPDATE PRODUCT QUANTITY (pid) IN CART (pid)
        this.router.put(`${this.path}/:cid/products/:pid`, async (req, res) => {
            const cartId = req.params.cid
            const prodId = req.params.pid
            const newQuantity = req.body

            try {
                await this.manager.putProductInCart(cartId, prodId, newQuantity)
                res.json({status: 200, message: `Product: ${prodId} updated successfully in cart: ${cartId}`})
            } catch (err) {
                res.json({status: 400, message: "Error updating product in cart", err})
            }
        })

        //////////////////////////////// DELETE ALL PRODUCTS FROM CART (cid)
        this.router.delete(`${this.path}/:cid/`, async (req, res) => {
            const cartId = req.params.cid
            try {
                await this.manager.deleteProductsFromCart(cartId)
                res.json({status: 200, message: `Products deleted from cart ${cartId}`})
            } catch (err) {
                res.json({status: 400, message: "Error deleting prods from cart", err})
            }
        })
    }
}

module.exports = CartsRouter



