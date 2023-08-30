const { Router } = require('express');
const { authRole } = require("../middleware/auth_role.js");

//TRAEMOS EL PRODUCT MANAGER PARA HACER USO DE SUS METODOS
const ViewsController = require("../controllers/views.controller.js");


class ViewsRouter {
    path = "/views";
    router = Router();
    viewsController = new ViewsController();

    constructor() {
        this.initRoutes();
    }

    initRoutes() {
        this.router.get(`${this.path}/products`, this.viewsController.renderProducts);

        this.router.get(`${this.path}/carts/:cid`, this.viewsController.renderCart);

        //////////////////////////////// WEBSOCKETS VIEWS
        this.router.get(`${this.path}/chat`, authRole('user'), this.viewsController.renderChat)

        this.router.get(`${this.path}/realtimeproducts`, this.viewsController.renderRealTimeProducts)

        //////////////////////////////// SESSION VIEWS 
        this.router.get(`${this.path}/login`, this.viewsController.renderLogin)

        this.router.get(`${this.path}/register`, this.viewsController.renderRegister)

        this.router.get(`${this.path}/private`, this.viewsController.renderPrivate)
    }
}

module.exports = ViewsRouter;