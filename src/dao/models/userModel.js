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
        unique: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        unique: true
    },
    role: {
        type: String,
        enum: ["admin", "usuario", "desarrollador"],
        required: true
    }
})

const userModel = mongoose.model(userCollection, userSchema)
module.exports = userModel