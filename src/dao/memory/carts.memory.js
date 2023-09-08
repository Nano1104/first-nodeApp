const fs = require('fs');
const ProductManager = require("../../prodManager.js");
const TicketsManager = require("../../managers/tickets.manager.js");

class CartsMemoDao {
    constructor() {
        this.prodManager = new ProductManager()
        this.ticketManager = new TicketsManager()
        this.JSONpath = "carts.json";
    }

    getCarts = async () => {
        if(fs.existsSync(this.JSONpath)) {
            const data = await fs.promises.readFile(this.JSONpath, 'utf8');
            const carts = JSON.parse(data)
            return carts
        } else {
            return []
        }
    }

    getCartById = async (id) => {
        const carts = await this.getCarts();
        const cartFound = carts.find(cart => cart.id == Number(id))
        return cartFound
    }

    getCartProducts = async (cartId) => {
        const cart = this.getCartById(cartId)
        return cart.products
    }

    creatCart = async () => {
        const carts = await this.getCarts();
        const newCart = { products: [] }
        carts.length === 0 ? newCart.id = 1 : newCart.id = carts[carts.length - 1].id + 1; //se crea el id de manera autoincramental

        carts.push(newCart);
        await fs.promises.writeFile(this.JSONpath, JSON.stringify(carts, null, '\t'))
    }

    postProductInCart = async (cid, pid) => {
        const carts = await this.getCarts();
        const prods = await this.prodManager.getProducts()
        const cartFound = carts.find(cart => cart.id === Number(cid))
        const prodToAdd = await prods.find(prod => prod.id === Number(pid))       //vemos si existe el product que se quiere agregar
        const indexProdToAdd = cartFound.products.findIndex(prod => prod.product == pid)      //obtenemos el index del objeto del products a modificar

        if(prodToAdd) {     // si existe el product con el id pasado por param se agregara o sumara el qunatity
            
            if(indexProdToAdd > -1) {                 //si ya existe el product que se quiere agregar solo aumenta la cantida 
                cartFound.products[indexProdToAdd].quantity += 1
                await fs.promises.writeFile(this.JSONpath, JSON.stringify(carts, null, '\t'))     
            } else {                        
                cartFound.products.push({                //en caso de no estar el prod en el cart, lo agrega por primera vez
                    "product": Number(pid),
                    "quantity": 1
                })
                await fs.promises.writeFile(this.JSONpath, JSON.stringify(carts, null, '\t'))      
            }
        } else {                                //en caso de que no exista el product con el id pasado por param en el products.json se enviara el siguiente mensaje
            console.log(`Does not exist product with Id: ${pid}`)
            res.status(400)
        }
    }

    deleteProductFromCart = async (cid, pid) => {
        const carts = await this.getCarts();
        const cartFound = carts.find(cart => cart.id == cid) 
        const cartIndex = carts.findIndex(cart => cart.id == cartFound.id)
        const indexToDelete = cartFound.products.findIndex(prod => prod.product == pid)
        carts[cartIndex].products.splice(indexToDelete, 1)

        await fs.promises.writeFile(this.JSONpath, JSON.stringify(carts, null, '\t'))
    }

    deleteProductsFromCart = async (cid) => {
        const carts = await this.getCarts();
        const cartFound = carts.find(cart => cart.id == cid) 
        cartFound.products = []

        await fs.promises.writeFile(this.JSONpath, JSON.stringify(carts, null, '\t'))
    }

    putProductsInCart = async (cid, arrProds) => {
        const carts = await this.getCarts();
        for(const prod of arrProds) {
            await this.postProductInCart(cid, prod)
        }
    }

    updateProdQuantityInCart = async (cid, pid, update) => {
        const carts = await this.getCarts()
        const cartFound = carts.find(cart => cart.id == cid)
        const indexToUpdate = cartFound.products.findIndex(prod => prod.product == pid)       //vemos si existe el product que se quiere agregar

        if(indexToUpdate > -1) {         //verifica si existe el prod a actualizar en el cart
            cartFound.products[indexToUpdate].quantity = update.quantity 
        } else {
            console.log("Prod to update does not exist in cart")
            res.status(400)
        }

        await fs.promises.writeFile(this.JSONpath, JSON.stringify(carts, null, '\t'))
    }

    finishPurchase = async (cid, user) => {

        /****** 
        EN ESTE CASO ME PASO QUE NO PUEDO HACER USO DEL USER EN MEMORY PERSISTENCE,
        PORQUE EL USER VIENE DEL TOKEN DE LA SESSION, EL CUAL ESTA DISPONIBLE 
        EN LA PERSISTENCE DE MONGO.

        TAMBIEN PASA QUE CUANDO QUIERO HACER UN PETICION A ALGUN ENDPOINT CON RESTRICCIONES
        NO PUEDO HACERLO ESTANDO EN LA PERSISTENCE DE MEMORY, PORQUE NO TENGO EL TOKEN DISPONIBLE
        ******/


        /* const carts = await this.getCarts()
        const cartFound = carts.find(cart => cart.id == cid) 
        const tickets = await this.ticketManager.getTickets()
        //ticket fields
        let totalPurchase = 0
        const generateCode = () => Math.random().toString(36).substring(2, 8);
        
        for(const prod of cartFound.products) {

        }

        const ticket = {
            code: generateCode(),
            amount: totalPurchase,
            purchaser: user.email
        }
        tickets.push(ticket)

        await fs.promises.writeFile(this.JSONpath, JSON.stringify(tickets, null, '\t')) */
    }
}

module.exports = CartsMemoDao




