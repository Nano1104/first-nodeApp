
class ProductsRepositoryDao {
    constructor(dao) {
        this.dao = dao;
    }

    getProducts = async () => {
        return await this.dao.getProducts();
    }

    getProductById = async () => {
        return await this.dao.getProductById();
    }

    createProduct = async () => {

    }

    updateProduct = async () => {

    }

    deleteProduct = async () => {

    }
}

module.exports = ProductsRepositoryDao;