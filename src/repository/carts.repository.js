
class CartsRepositoryDao {
    constructor(dao) {
        this.dao = dao
    }
        
    getCarts = async () => {
        return await this.dao.getCarts()
    }

    getCartById = async (id) => {
        return await this.dao.getCartById(id)
    }

    getCartProducts = async (cartId) => {
        const cartFound = await this.dao.getCartProducts(cartId)
        return cartFound.products
    }
    
    creatCart = async () => {
        return await this.dao.creatCart()
    }

    postProductInCart = async (cid, pid) => {
        return await this.dao.postProductInCart(cid, pid)
    }

    deleteProductFromCart = async (cid, pid) => {
        return await this.dao.deleteProductFromCart(cid, pid)
    }

    deleteProductsFromCart = async (cid) => {
        return await this.dao.deleteProductsFromCart(cid)
    }

    putProductsInCart = async (cid, arrProds) => {
        return await this.dao.putProductsInCart(cid, arrProds)
    }

    updateProdQuantityInCart = async (cid, pid, update) => {
        return await this.dao.updateProdQuantityInCart(cid, pid, update)
    }
}

module.exports = CartsRepositoryDao