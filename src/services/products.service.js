
class ProductsServiceDao {
    constructor(repository) {
        this.repository = repository;
    }

    getProducts = async () => {
        return await this.repository.getProducts();
    }

    getProductById = async (id) => {
        return await this.repository.getProductById(id);
    }

    creatProduct = async (productBody) => {
        const newProduct = await this.repository.createProduct(productBody)
        return newProduct
    }

    updateProduct = async (id, update) => {
        await this.repository.updateProduct(id, update)
    }

    deleteProduct = async (id) => {
        await this.repository.deleteProduct(id)
    }
}

module.exports = ProductsServiceDao;