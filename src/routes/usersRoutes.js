const { Router } = require("express");
const passport = require('passport');

const { passportCall } = require("../utils/passportcall.js");
const { authRole } = require("../middleware/auth_role.js");

const UserController = require("../controllers/users.controller.js");

class UsersRouter {
    path = "/users";
    router = Router();
    userController = new UserController()

    constructor() {
        this.initProdsRoutes();
    }

    initProdsRoutes() {
        //////////////////////////////// SHOW USERS
        this.router.get(`${this.path}`, [passportCall('jwt'), authRole('admin')], this.userController.showUsers); 

        //////////////////////////////// DELETE USER
        this.router.delete(`${this.path}/:uid`, [passportCall('jwt'), authRole('admin')], this.userController.deleteUsers); 

        //////////////////////////////// DELETE INACTIVE USERS
        this.router.delete(`${this.path}`, [passportCall('jwt'), authRole('admin')], this.userController.deleteInactiveUsers); 

        //////////////////////////////// CURRENT
        this.router.get(`${this.path}/current`, passportCall('jwt'), this.userController.showCurrentUser); 

        //////////////////////////////// PREMIUM USER
        this.router.get(`${this.path}/premium/:uid`, this.userController.changeRole)

        /* //////////////////////////////// PREMIUM USER
        this.router.post(`${this.path}/:uid/documents`, this.userController.postDocument) */

        //////////////////////////////// PRIVATE
        this.router.get(`${this.path}/private`, passportCall('jwt'), this.userController.showPrivateUser);
    }
}

module.exports = UsersRouter;