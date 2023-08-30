
class CartsRepositoryDao {
    constructor(dao) {
        this.dao = dao
    }
        
    getCarts = async () => {
        await this.dao.getCarts()
    }

    getCartById = async (id) => {
        await this.dao.getCartById(id)
    }

    getCartProducts = async (cartId) => {
        const cartProducts = await this.dao.getCartProducts(cartId)
        return cartProducts
    }
    
    creatCart = async () => {
        await this.dao.creatCart()
    }

    postProductInCart = async (cid, pid) => {
        await this.dao.postProductInCart(cid, pid)
    }

    deleteProductFromCart = async (cid, pid) => {
        await this.dao.deleteProductFromCart(cid, pid)
    }

    deleteProductsFromCart = async (cid) => {
        await this.dao.deleteProductsFromCart(cid)
    }

    putProductsInCart = async (cid, arrProds) => {
        await this.dao.putProductsInCart(cid, arrProds)
    }

    updateProdQuantityInCart = async (cid, pid, update) => {
        await this.dao.updateProdQuantityInCart(cid, pid, update)
    }
}

module.exports = CartsRepositoryDao