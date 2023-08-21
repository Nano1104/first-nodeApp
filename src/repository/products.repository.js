
class ProductsRepositoryDao {
    constructor(dao) {
        this.dao = dao;
        console.log(dao) ///////////////////undefined
    }

    getProducts = async () => {
        return await this.dao.getProducts();
    }

    getProductById = async (id) => {
        await this.dao.getProductById(id);
        console.log(dao)
    }

    createProduct = async (product) => {
        return await this.dao.createProduct(product);
    }

    updateProduct = async () => {

    }

    deleteProduct = async () => {

    }
}

module.exports = ProductsRepositoryDao;