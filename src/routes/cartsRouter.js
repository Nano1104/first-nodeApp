import fs from 'fs';
import { Router } from "express";
const router = Router();

const path = 'carrito.json';    //ruta al carrito json

import ProductManger from '../index.js';    //traemos la clase constructora del index.js para poder trabajar con los products del json
const manager = new ProductManger();


const getCarts = async (req, res) => {      //funcion para traer el carrito json en caso de que no este vacio
    if(fs.existsSync(path)) {
        const data = await fs.promises.readFile(path, 'utf8');
        const carts = JSON.parse(data)
        return carts
    } else {
        return []
    }
}

//////////////////////////////// GET CART PRODUCTS
router.get('/:cid', async (req, res) => {
    const carts = await getCarts()
    const cartFound = carts.find(cart => cart.id === Number(req.params.cid))    //encontramos el cart del id pasado por param
    res.json(cartFound.products)
})

//////////////////////////////// POST CART
router.post('/', async (req, res) => {
    const carts = await getCarts();
    const newCart = {   //se crea el nuevo cart
        "products": []
    }

    carts.length === 0 ? newCart.id = 1 : newCart.id = carts[carts.length - 1].id + 1; //se crea el id de manera autoincramental
    carts.push(newCart);
    await fs.promises.writeFile(path, JSON.stringify(carts, null, '\t'))
    res.send({status: 200, message: "New Cart Added"})
})


//////////////////////////////// POST CART
router.post('/:cid/product/:pid', async (req, res) => {
    const carts = await getCarts()
    const prods = await manager.getProducts()
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

})


export default router
