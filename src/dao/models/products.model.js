const mongoose = require('mongoose');

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean
    },
    stock: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnail: {
        type: Array,
        default: []
    }
})

const productsModel = mongoose.model(productsCollection, productsSchema);
module.exports = productsModel;