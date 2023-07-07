const productsModel = require('../models/products.model.js');

class ProductsManager {
    getProducts = async () => {
        try {
            const products = await productsModel.find({}).lean()
            return products
        } catch(err) {
            console.log('Error to get products', err);
        }
    }

    getProductById = async (id) => {
        try {
            const productFound = await productsModel.findById({ _id: id})
            return productFound
        } catch(err) {
            console.log('Error to get product by Id', err);
        }
    }

    creatProduct = async (productBody) => {
        const { title, description, code, price, stock, category } = productBody
        if(!title || !description || !code || !price || !stock || !category) return response.send({status: "error", message: "Incompleted fields"})

        const newProduct = await productsModel.create({
            ...productBody,
            code: productBody.code.toLowerCase()
        })
        console.log(newProduct)
        return newProduct
    }

    updateProduct = async (id, update) => {
        try {
            await productsModel.findByIdAndUpdate({ _id: id }, {
                ...update
            })
            console.log("product updated successfully");
        } catch(err) {
            console.log("could not update product", err);
        }
    }

    deleteProduct = async (id) => {
        try {
            await productsModel.findByIdAndDelete({ _id: id })
            console.log("product deleted successfully");
        } catch(err) {
            console.log("could not delete product", err);
        }
    }
}

module.exports = ProductsManager


