const mongoose = require('mongoose');

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
    products: {
        type: Array,
        required: true,
        default: []
    }
})

const cartsModel = mongoose.model(cartsCollection, cartsSchema);
module.exports = cartsModel