const CartsRouter = require('../../routes/cartsRouter.js');
const cartsModel = require('../models/carts.model.js');

const ProductsManager = require("./products.manager.js");

class CartsManager {
    manager = new ProductsManager();

    getCarts = async () => {
        const carts = await cartsModel.find({})
        return carts
    }

    getCartById = async (id) => {
        return await cartsModel.findById({ _id: id })
    }

    getCartProducts = async (cartId) => {
        const cartFound = await cartsModel.findById({ _id: cartId })
        return cartFound.products
    }

    creatCart = async () => {
        const newCart = {
            products: []
        }
        await cartsModel.create({ ...newCart })
    }

    postProductInCart = async (cid, pid) => {
        const cart = await cartsModel.findById({ _id: cid })
        const prods = await this.manager.getProducts()
        const prodCheck = prods.find(prod => prod.id === pid)
       
        if(prodCheck) {                            //verifica que el product exista en la collection de products
            const prodToAdd = cart.products.find(prod => prod.product === pid)
            console.log(prodToAdd)
            if(prodToAdd !== undefined) {          //en caso de que el product ya estuviera agregado el el array prodcuts se suma en 1 su quantity
                const index = cart.products.indexOf(prodToAdd)
                cart.products[index].quantity += 1
                await cartsModel.findByIdAndUpdate({ _id: cid }, {
                    products: [
                        ...cart.products
                    ]
                })
            } else {                                //si el product es nuevo en el array products se crea de la siguiente manera:
                await cartsModel.findByIdAndUpdate({ _id: cid }, {
                    products: [
                        ...cart.products,
                        {
                            product: pid,
                            quantity: 1
                        }
                    ]
                });
            }
        } else {
            return false
        }
    }
}

module.exports = CartsManager