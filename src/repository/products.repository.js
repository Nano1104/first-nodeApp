const productsModel = require('../models/products.model.js');

class ProductsRepositoryDao {
    getProducts = async () => {
        const products = await productsModel.find({}).lean()
        return products
    }

    getProductById = async (id) => {
        const productFound = await productsModel.findById({ _id: id})
        return productFound
    }

    creatProduct = async (productBody) => {
        const { title, description, code, price, stock, category } = productBody
        if(!title || !description || !code || !price || !stock || !category) return response.send({status: "error", message: "Incompleted fields"})

        const newProduct = await productsModel.create({
            ...productBody,
            code: productBody.code.toLowerCase()
        })
        return newProduct
    }

    updateProduct = async (id, update) => {
        await productsModel.findByIdAndUpdate({ _id: id }, {
            ...update
        })
    }

    deleteProduct = async (id) => {
        await productsModel.findByIdAndDelete({ _id: id })
    }
}

module.exports = ProductsRepositoryDao;