
class ProductsServiceDao {
    constructor(dao) {
        this.dao = dao;
    }

    getProducts = async () => {
        return await this.dao.getProducts();
    }

    getProductById = async (id) => {
        return await this.dao.getProductById(id);
    }

    creatProduct = async (productBody) => {
        const newProduct = await this.dao.createProduct(productBody)
        return newProduct
    }

    updateProduct = async (id, update) => {
        await this.dao.updateProduct(id, update)
    }

    deleteProduct = async (id) => {
        await this.dao.deleteProduct(id)
    }
}

module.exports = ProductsServiceDao;