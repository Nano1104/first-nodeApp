const UserDto = require("../dto/user.dto.js");
const userModel = require("../models/userModel.js")

class UserController {
    showCurrentUser = async (req, res) => {
        try {
            if(!req.user.user) throw new Error("There's no current user");
            const userData = new UserDto(req.user.user)
            res.render("user", userData)
        } catch (err) {
            res.status(400).json({message: "Error showing user", err: err})
        }
    }
    
    getUserById = async (req, res) => {
        try { //hace el populate para mostrar todos los prods que tenga en el cart
            const userFound = await userModel.findById(req.params.uid).populate('cart') 
            res.status(200).json({ message: `User with Id: ${req.params.uid}`, user: userFound})
        } catch (err) {
            res.status(400).json({message: `Error getting user by Id: ${req.params.uid}`, err: err})
        }
    }

    changeRole = async (req, res) => {
        try {
            const userId = req.params.uid
            const userFound = await userModel.findById(userId)
            if(!userFound) return res.status(401).json({message: "This user does not exist"})

            if(userFound.role == "user") {
                userFound.role = "premium"
            } else {
                userFound.role = "user"
            }

            await userModel.findByIdAndUpdate(userId, { role: userFound.role })
            res.status(200).json({ message: "User premium change role", result })
        } catch (err) {
            res.status(400).json({ message: "Error changing premium role", error: err })
        }
    }

    postDocument = async (req, res) => {
        try {
            
        } catch (err) {
            
        }
    }
}

module.exports = UserController;