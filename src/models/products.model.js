const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
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
    stock: {
        type: Number,
        required: true,
        index: true
    },
    category: {
        type: String,
        enum: ["SHIRT", "PANT", "SNEAKER", "HAT", "SHORT", "HOODIE", "JACKET"],
        required: true
    },
    thumbnail: {
        type: Array,
        default: []
    }
})

productsSchema.plugin(mongoosePaginate)

const productsModel = mongoose.model(productsCollection, productsSchema);
module.exports = productsModel;