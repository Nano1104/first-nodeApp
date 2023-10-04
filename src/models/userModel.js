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
        unique: true,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        unique: true
    },
    documents: [
        {
            name: {
              type: String,
              required: true,
            },
            reference: {
                type: String,
                required: true,
            },
        },
    ],
    role: {
        type: String,
        enum: ["user", "admin", "developer"],
        required: true
    },
    last_connection: {
        type: Date,
        default: Date.now
    }
})

const userModel = mongoose.model(userCollection, userSchema)
module.exports = userModel