const fs = require('fs');
const { Router } = require("express");

//TRAEMOS EL PRODUCT MANAGER PARA HACER USO DE SUS METODOS Y TRABAJAR CON LOS PRODUCTS DEL JSON
const ProductManager = require('../prodManager.js');                //este es el prodManager de Filesytem
const CartsController = require("../controllers/carts.controller.js");


class CartsRouter {
    path = '/carts';
    JSONpath = 'carts.json';
    router = Router();
    cartsController = new CartsController()
    /* prodManager = new ProductManager(); */           //para usar con fileSystem

    constructor() {
        this.initCartsRoutes();
    }

    initCartsRoutes() {
        const getCarts = async (req, res) => {      //funcion para traer el carrito json en caso de que no este vacio y trabajar ocn fileSystem
            if(fs.existsSync(this.JSONpath)) {
                const data = await fs.promises.readFile(this.JSONpath, 'utf8');
                const carts = JSON.parse(data)
                return carts
            } else {
                return []
            }
        }

        //////////////////////////////// GET CARTS
        this.router.get(`${this.path}`, this.cartsController.getCarts)

        //////////////////////////////// GET CART PRODUCTS
        this.router.get(`${this.path}/:cid`, this.cartsController.getCartProducts)

        //////////////////////////////// POST CART
        this.router.post(`${this.path}`, this.cartsController.creatCart)

        //POST CART con Filesystem
            /* const carts = await getCarts();
            const newCart = { products: [] }
            carts.length === 0 ? newCart.id = 1 : newCart.id = carts[carts.length - 1].id + 1; //se crea el id de manera autoincramental

            carts.push(newCart);
            await fs.promises.writeFile(this.JSONpath, JSON.stringify(carts, null, '\t')) */

        
        //////////////////////////////// POST PRODUCT IN CERTAIN CART
        this.router.post(`${this.path}/:cid/products/:pid`, this.cartsController.postProductInCart)

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

        //////////////////////////////// DELETE PRODUCT (pid) FROM CART (cid)
        this.router.delete(`${this.path}/:cid/products/:pid`, this.cartsController.deleteProductFromCart)

        //////////////////////////////// DELETE ALL PRODUCTS FROM CART (cid)
        this.router.delete(`${this.path}/:cid/`, this.cartsController.deleteProductsFromCart)

        //////////////////////////////// UPDATE PRODUCTS IN CART (cid)
        this.router.put(`${this.path}/:cid`, this.cartsController.putProductsInCart)

        //////////////////////////////// UPDATE PRODUCT QUANTITY (pid) IN CART (pid)
        this.router.put(`${this.path}/:cid/products/:pid`, this.cartsController.updateProdQuantityInCart)

    }
}

module.exports = CartsRouter



