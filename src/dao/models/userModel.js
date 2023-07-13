const mongoose = require('mongoose');
const userCollection = "user"

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: String,
    age: Number,
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "usuario", "desarrollador"],
        required: true
    }
})

const userModel = mongoose.model(userCollection, userSchema)
module.exports = userModel