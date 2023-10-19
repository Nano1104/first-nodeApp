const productsModel = require('../../models/products.model.js');
const userModel = require("../../models/userModel.js");

class ProductsMongoDao {
    getProducts = async () => {
        const products = await productsModel.find({}).lean().populate('owner')
        return products
    }

    getProductById = async (id) => {
        const productFound = await productsModel.findById(id).populate('owner')
        return productFound
    }

    createProduct = async (productBody) => {
        const { title, description, code, price, stock, category, owner } = productBody
        if(!title || !description || !code || !price || !stock || !category) return response.send({status: "error", message: "Incompleted fields"})

        const prodToAdd = {
            ...productBody,
            code: productBody.code.toLowerCase()
        }

        if(owner) {                                 //si existe un owner y es premium
            const userFound = await userModel.findOne({email: owner})
            if(userFound.role == "premium") {
                prodToAdd.owner = userFound._id         
            }
        }
        
        const newProduct = await productsModel.create({ ...prodToAdd })
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

module.exports = ProductsMongoDao;