const mongoose = require('mongoose');
const ticketCollection = "ticket";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: Number,
    purchaser: {
        type: String,
        unique: true
    }
})

const ticketModel = mongoose.model(ticketCollection, ticketSchema);
module.exports = ticketModel;