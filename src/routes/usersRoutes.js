const { Router } = require("express");
const passport = require('passport');

const { passportCall } = require("../utils/passportcall.js");
const { authRole } = require("../middleware/auth_role.js");

const UserController = require("../controllers/users.controller.js");

class UsersRouter {
    path = "/user";
    router = Router();
    userController = new UserController()

    constructor() {
        this.initProdsRoutes();
    }

    initProdsRoutes() {

        //////////////////////////////// CURRENT
        this.router.get(`${this.path}/current`, [passportCall('jwt'), authRole('admin')], this.userController.showCurrentUser); 

        //////////////////////////////// PRIVATE
        this.router.get(`${this.path}/private`);
    }
}

module.exports = UsersRouter;