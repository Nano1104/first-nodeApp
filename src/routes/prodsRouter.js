const { Router } = require("express");

//TRAEMOS EL PRODUCT MANAGER PARA HACER USO DE SUS METODOS
const ProductsManager = require("../dao/managers/products.manager.js");

class ProdsRouter {
    path = "/products";
    router = Router();
    manager = new ProductsManager();

    constructor() {
        this.initProdsRoutes();
    }

    initProdsRoutes() {
        //////////////////////////////// GET PRODUCTS
        this.router.get(`${this.path}`, async (req, res) => {
            const { limit } = req.query
            if(limit === '') {     
                res.json(await this.manager.getProducts())   //En caso de que no se espicique el limit en la URL, devuelve el array completo
            } else {               
                const prods = await this.manager.getProducts()   //Devuelve la cantidad especificada en la URL
                res.json(prods.slice(0, limit))
            }
        })

        //////////////////////////////// GET BY ID
        this.router.get(`${this.path}/:pid`, async (req, res) => {
            const product = await this.manager.getProductById(req.params.pid)
            res.json(product);
        })

        //////////////////////////////// ADD PRODUCT
        this.router.post(`${this.path}`, async (req, res) => {
            /* let io = req.app.get('socketio');       //IMPORTAMOS LA VARIABLE GLOBAL EN EL POST DESDE LA APP
            const prod = req.body
            const { title, description, code, price, status, stock, category, thumbnails } = prod

            if(await this.manager.addProduct(title, description, code, price, status, stock, category, thumbnails)) {    //si se completaron los campos se agregara de manera correcta 
                res.send({status: 200, "message": "Product added successfully"})     
                io.emit('postReq', await this.manager.getProducts())        
            } else {
                res.send({status: 400, "message": "Error adding product, some fields may be empty"})                //de lo contrario tira error 
            } */
            try {
                const product = req.body
                await this.manager.creatProduct(product)
                res.send({status: 200, message: "product added successfully"})
            } catch(err) {
                res.send({status: 400, "message": "Error creating product, some fields may be empty"})
            }
        })

        //////////////////////////////// UPDATE PRODUCT
        this.router.put(`${this.path}/:pid`, async (req, res) => {
            const update = req.body
            await this.manager.updateProduct(req.params.pid, update)
            res.send({status: 200, "message": "Product updated successfully"})
        })

        //////////////////////////////// DELETE PRODUCT
        this.router.delete(`${this.path}/:pid`, async (req, res) => {
            /* let io = req.app.get('socketio');       //IMPORTAMOS LA VARIABLE GLOBAL EN EL POST DESDE LA APP
            
            const id = Number(req.params.pid)
            await this.manager.deleteProduct(id)
            res.send({status: 200, message: "Product deleted successfully"})
            io.emit('deleted-prod', await this.manager.getProducts()) */

            await this.manager.deleteProduct(req.params.pid)
        })

    }
}

module.exports = ProdsRouter;


