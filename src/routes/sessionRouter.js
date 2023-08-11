const { Router } = require("express");
const passport = require('passport');

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
        this.router.get(`${this.path}/logout`, this.sessionController.sessionLogout);

        //////////////////////////////// SESSION-LOGIN
        this.router.post(`${this.path}/login`, passport.authenticate('login', { failureRedirect: `/api${this.path}/faillogin` }), this.sessionController.sessionLogin); 

        //////////////////////////////// SESSION-REGISTER
        this.router.post(`${this.path}/register`, passport.authenticate('register', {failureRedirect: `/api${this.path}/failregister`}), this.sessionController.sessionRegister);

        //////////////////////////////// GITHUB
        this.router.get(`${this.path}/github`, passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {})

        this.router.get(`${this.path}/github/callback`, passport.authenticate('github', {failureRedirect: `/api${this.path}/login`}), this.sessionController.sessionGithub)

        //////////////////////////////// LOGIN
        this.router.get(`${this.path}/login`, this.sessionController.renderLogin)

        //////////////////////////////// FAILREGISTER
        this.router.get(`${this.path}/faillogin`, this.sessionController.renderFailLogin)
        
        //////////////////////////////// FAILREGISTER
        this.router.get(`${this.path}/failregister`, this.sessionController.renderFailRegister)

        //////////////////////////////// PRIVATE
        this.router.get(`${this.path}/private`, async(req, res) => this.sessionController.renderPrivate)
    }
}

module.exports = SessionRouter;