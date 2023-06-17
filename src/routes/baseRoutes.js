const { Router } = require('express');

class BaseRoute {
    path = '/alive';
    router = Router();

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.router.get(`${this.path}`, () => {
            res.status(200).json({ok: true, message: 'I am alive!'});
        })
    }
}

module.exports = BaseRoute;