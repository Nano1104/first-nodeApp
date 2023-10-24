const { Router } = require("express");
const passport = require('passport');
const { passportCall } = require("../utils/passportcall.js");
const SessionController = require("../controllers/session.controller.js");

class SessionRouter {
    path = "/session";
    router = Router();
    sessionController = new SessionController();

    constructor() {
        this.initProdsRoutes();
    }

    initProdsRoutes() {
        //////////////////////////////// SESSION-LOGOUT
        this.router.get(`${this.path}/logout`, passportCall('jwt'), this.sessionController.sessionLogout); 

        //////////////////////////////// SESSION-LOGIN
        this.router.post(`${this.path}/login`, this.sessionController.sessionLogin); 

        //////////////////////////////// SESSION-REGISTER
        this.router.post(`${this.path}/register`, this.sessionController.sessionRegister)

        //////////////////////////////// FAILREGISTER
        this.router.get(`${this.path}/faillogin`, this.sessionController.renderFailLogin)
        
        //////////////////////////////// FAILREGISTER
        this.router.get(`${this.path}/failregister`, this.sessionController.renderFailRegister)
    }
}

module.exports = SessionRouter;