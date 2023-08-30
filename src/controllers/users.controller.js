const UserDto = require("../dto/user.dto.js");

class UserController {
    showCurrentUser = async (req, res) => {
        try {
            const userData = new UserDto(req.user.user)
            res.render("user", userData)
        } catch (err) {
            res.status(400).json({message: "Error showing user", err: err})
        }
    }
}

module.exports = UserController;