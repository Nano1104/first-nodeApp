const UserDto = require("../dto/user.dto.js");
const userModel = require("../models/userModel.js");
const { EMAIL } = require("../config/config.js");
const { transporter } = require("../utils/emailTransporter.js");

class UserController {

    showUsers = async (req, res) => {
        try {
            const users = await userModel.find({}).lean()
            if(NODE_ENV == "development") {
                res.status(200).json({message: "Success getting users", users})
            } else {
                res.render("users", {users})
            }
        } catch (err) {
            res.status(500).json({message: "Error getting users", err: err})
        }
    }

    deleteUsers = async (req, res) => {
        try {
            await userModel.findByIdAndRemove(req.params.uid)
            res.status(200).json({message: "User deleted successfully"})
        } catch (err) {
            res.status(500).json({message: "Error deleting user", err: err})
        }
    }

    deleteInactiveUsers = async (req, res) => {
        try {
            const users = await userModel.find({}).lean()
            //esto declara la variable con los ultimos 30 minutos
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
            const usersInactive = users.filter(user => user.last_connection < twoDaysAgo)  //filtra y genera un array de los usuarios inactivos

            for (const user of usersInactive) {
                try {
                    await userModel.findByIdAndRemove(user._id);
                    const mailOptions = {
                        from: `${EMAIL}`,
                        to: user.email,
                        subject: "Eliminación de cuenta por inactividad",
                        text: "Tu cuenta ha sido eliminada debido a la inactividad"
                    };
                    const info = await transporter.sendMail(mailOptions);
                    console.log("Correo de notificación enviado:", info.response);
                } catch (err) {
                    console.error("Error al eliminar usuario o enviar correo:", err);
                }
            }

            res.json({message: "Success deleting inactive users"})
        } catch (err) {
            res.status(500).json({message: "Error deleting user", err: err})
        }
    }

    showCurrentUser = async (req, res) => {
        try {
            let isAdmin;
            if(!req.user.user) throw new Error("There's no current user");
            const userData = new UserDto(req.user.user)
            if(userData.role == "admin") isAdmin = true
            res.render("user", { UserDto: userData, isAdmin})
        } catch (err) {
            res.status(400).json({message: "Error showing user", err: err})
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

            const result = await userModel.findByIdAndUpdate(userId, { role: userFound.role })
            res.status(200).json({ message: "User change role", result })
        } catch (err) {
            res.status(400).json({ message: "Error changing premium role", error: err })
        }
    }

    showPrivateUser = async (req, res) => {
        try {
            if(!req.user.user) throw new Error("There's no current user");
            const user = req.user.user
            console.log(user)
            res.render("private", user)
        } catch (err) {
            res.status(400).json({message: "Error showing private user", err: err})
        }
    }
}

module.exports = UserController;