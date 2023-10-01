const productsModel = require("../../models/products.model.js");
const cartsModel = require("../../models/carts.model.js");
const ticketModel = require("../../models/ticket.model.js");

class CartsMongoDao {

    getCarts = async () => {
        const carts = await cartsModel.find({}).populate('products.product')
        return carts
    }

    getCartById = async (id) => {
        return await cartsModel.findById(id).populate('products.product')
    }

    getCartProducts = async (cartId) => {
        const cartFound = await cartsModel.findById({ _id: cartId }).lean().populate('products.product')
        return cartFound.products
    }

    creatCart = async () => {
        const newCart = {
            products: []
        }
        const result = await cartsModel.create({ ...newCart })
        return result
    }

    postProductInCart = async (cid, pid) => {
        const cart = await cartsModel.findById(cid)
        const prodToAdd = await productsModel.findById(pid)

        if(prodToAdd) {                            //verifica que el product exista en la collection de products
            const prodInCart = cart.products.find(prod => prod.product.toString() === pid)
            if(prodInCart) {                     //en caso de que el product ya estuviera agregado el el array products se suma en 1 su quantity
                const index = cart.products.indexOf(prodInCart)
                cart.products[index].quantity += 1
                await cartsModel.findByIdAndUpdate(cid, {
                    products: [
                        ...cart.products
                    ]
                })
            } else {                                        //si el product es nuevo en el array products se crea de la siguiente manera:
                await cartsModel.findByIdAndUpdate(cid, {
                    products: [
                        ...cart.products,                   //reescribe el array de products con los prods anteriores mas el nuevo asi no se repiten
                        {
                            product: pid,
                            quantity: 1
                        }
                    ]
                });
            }
        }
    }

    deleteProductFromCart = async (cid, pid) => {
        const cart = await cartsModel.findById(cid);
        const index = cart.products.findIndex(prods => prods.product === pid);
        cart.products.splice(index, 1)                      //hace un splice para eliminar el prod del carrito
        const cartUpdated = cart.products.slice(0)          //y luego hace una copia del array products sin el prod eliminado
        await cartsModel.findByIdAndUpdate(cid, {products: [ ...cartUpdated ]})     //y pasamos el array products actualizado 
    }

    deleteProductsFromCart = async (cid) => {
        await cartsModel.findByIdAndUpdate(cid, { products: []})
        const emptyCart = await this.getCartById(cid)
        return emptyCart
    }

    putProductsInCart = async (cid, arrProds) => {
        const cart = await cartsModel.findById(cid); 

        for(const product of arrProds) {
            const prodToAdd = await productsModel.findById(product)
            if(prodToAdd) {                                        //verifica si el objeto que se quiere agregar o actualizar existe o no en el json de products
                let index = cart.products.findIndex(prod => prod.product.toString() === product)
                if(index !== -1) {                              //en caso de que el objeto ya se encuentra en el array de products del cart
                    cart.products[index].quantity += 1              //le suma la cantidad a ese objeto en 1
                    await cartsModel.findByIdAndUpdate(cid, {
                        products: [
                            ...cart.products
                        ]
                    })
                } else {
                    await cartsModel.findByIdAndUpdate(cid, {
                        products: [
                            ...cart.products,                   //reescribe el array de products con los prods anteriores mas el nuevo asi no se repiten
                            {
                                product: product,
                                quantity: 1
                            }
                        ]
                    })
                }
            }
        }
    }

    updateProdQuantityInCart = async (cid, pid, update) => {
        const cart = await cartsModel.findById(cid);
        const index = cart.products.findIndex(p => p.product.toString() === pid);           //busca el indice del prod a actualizar pasando el p.product a string 
                                                                                            //ya que es un ObjectId, de esa manera lo podemos comparar con pid
        cart.products[index].quantity = update.quantity                      //actualiza la cantidad del prod encontrado con la cantidad del body (update.quantity)
        await cartsModel.findByIdAndUpdate(cid, {products: [
            ...cart.products,
        ]})
    }

    finishPurchase = async (cid, user) => {
        const cart = await cartsModel.findById(cid);
        const prodsNotAvailable = [];
        //ticket fields
        let totalPurchase = 0
        const generateCode = () => Math.random().toString(36).substring(2, 8);

        for(const prod of cart.products) {       //por cada producto que tenga el carrito
            const id = prod.product
            const prodFound = await productsModel.findById(id)            //encuentra cada prod por su id
            if(prodFound.stock >= prod.quantity) {                        //y resta del stock del producto
                totalPurchase += (prodFound.price * prod.quantity)
                await productsModel.findByIdAndUpdate(id, {
                    ...prodFound,
                    stock: prodFound.stock -= prod.quantity               //la cantidad del product del carrito
                })
            } else {                            //si el producto no se puede comprar por un tema de stock
                prodsNotAvailable.push(prod)       //se agrega al array de productos no disponibles
            }
        }

        try {               //CREACION DEL TICKET
            await ticketModel.create({
              code: generateCode(),
              amount: totalPurchase,
              purchaser: user.email
            });
          } catch (error) {
            console.error(error);
        }

        cart.products = []       //VACIAMOS EL CARRITO
        for(const prod of prodsNotAvailable) {      //y agregamos todos los que no se pudieron comprar'
            const leanProd = prod.toObject({ getters: true, virtuals: false });        //esta funcion se encarga de convertir cada prod en un objeto simple
            cart.products.push(leanProd);                                              //ya que mongoose hara referencia como si cada prod fuera un doc nuevo
        }                                                                              //y devolvera un resultado no deseado
        await cart.save();
    }
}

module.exports = CartsMongoDao
