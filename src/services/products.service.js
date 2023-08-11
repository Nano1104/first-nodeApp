/* const productsModel = require('../models/products.model.js'); */
const ProductsRepositoryDao = require('../repository/products.repository.js');

class ProductsService {
    constructor() {
        this.productsRepository = new ProductsRepositoryDao()
    }

    getProducts = async () => {
        return await this.productsRepository.getProducts();
    }

    getProductById = async (id) => {
        return await this.productsRepository.getProductById(id);
    }

    creatProduct = async (productBody) => {
        const newProduct = await this.productsRepository.createProduct(productBody)
        return newProduct
    }

    updateProduct = async (id, update) => {
        await this.productsRepository.updateProduct(id, update)
    }

    deleteProduct = async (id) => {
        await this.productsRepository.deleteProduct(id)
    }
}

module.exports = ProductsService;