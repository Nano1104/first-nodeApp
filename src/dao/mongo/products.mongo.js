const productsModel = require('../../models/products.model.js');
const userModel = require("../../models/userModel.js");

const { EMAIL } = require("../../config/config.js");
const { transporter } = require("../../utils/emailTransporter.js");

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

        if(owner) {                                 //si existe un owner y es premium //REVISARRR
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
        const prodToDelete = await productsModel.findById(id)
        const prodOwner = prodToDelete.owner
        if(!prodToDelete) console.log("Product not found")  //si no existe el producto

        const userToWarn = await userModel.findById(prodToDelete.owner)
        await productsModel.findByIdAndDelete({ _id: id })      //elimina el producto

        if(prodOwner && userToWarn.role == "premium") {     //en caso de que el producto tengo un owner y sea premium
            console.log(userToWarn)
            const mailOptions = {
                from: `${EMAIL}`,
                to: userToWarn.email,
                subject: "Eliminación producto para usuario premium",
                text: "Su producto ha sido eliminado"
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(`Error de eliminacion de producto: ${error}`);
                } else {
                    console.log(`Email de eliminacion de producto enviada: ${info.response}`);
                }
            });
        }

    }
}

module.exports = ProductsMongoDao;