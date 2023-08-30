
class ProductsRepositoryDao {
    constructor(dao) {
        this.dao = dao;
    }

    getProducts = async () => {
        return await this.dao.getProducts();
    }

    getProductById = async (id) => {
        return await this.dao.getProductById(id);
    }

    createProduct = async (product) => {
        return await this.dao.createProduct(product);
    }

    updateProduct = async (pid, update) => {
        return await this.dao.updateProduct(pid, update)
    }

    deleteProduct = async (id) => {
        return await this.dao.deleteProduct(id)
    }
}

module.exports = ProductsRepositoryDao;