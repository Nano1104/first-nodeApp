const { Router } = require("express");

//TRAEMOS EL PRODUCT MANAGER PARA HACER USO DE SUS METODOS
const ProductsManager = require("../dao/managers/products.manager.js");
const productsModel = require("../dao/models/products.model.js");

class ProdsRouter {
    path = "/products";
    router = Router();
    manager = new ProductsManager();

    constructor() {
        this.initProdsRoutes();
    }

    initProdsRoutes() {

        const sortVal = (sort) => {             //defina el valor del sort dependiendo si es 'asc' o 'desc'
            let sortLow = sort.toLowerCase();
            if(sortLow === 'asc') {
                return { price: 1 }
            } else if(sortLow === 'desc') {
                return { price: -1 }
            }
        }
        
        //////////////////////////////// GET PRODUCTS
        this.router.get(`${this.path}`, async (req, res) => {
            let sortOption;
            const baseURL = 'http://localhost:5000/api/products/'
            const { limit = 10, page = 1, query, sort } = req.query
            const filter = query ? { category: query.toUpperCase() } : {}           //si llega por el params "query" se hara el filtrado en la aggregation 
    
            const { totalDocs, totalPages, hasPrevPage, hasNextPage, nextPage, prevPage } = await productsModel.paginate({}, { page, lean: true })

            const pipeline = [
                { $match: filter },
                { $limit: Number(limit) },
              ];

            if(sort) {                                      //dependiendo si llega o no el sort por query, suma un $sort al aggregation dependiendo si 
                sortOption = sortVal(sort)                  //es asc o desc para que haga un ordenamiento   
                pipeline.unshift({ $sort: sortOption })
            }

            const docsPaginated = await productsModel.aggregate(pipeline)  //devuelve los docs paginados una vez hecha la aggregation
            
            res.json({
                status: 200,
                payload: docsPaginated,
                totalDocs,
                totalPages,
                prevPage,
                nextPage,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `${baseURL}?page=${page - 1}` : null,
                nextLink: hasNextPage ? `${baseURL}?page=${page + 1}` : null  
            })
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
        this.router.put(`${this.path}/:pid`, async (req, res) => {      //VERIFICAR SI NO EXISTE EL PROD CON EL ID
            const update = req.body
            await this.manager.updateProduct(req.params.pid, update)
            res.send({status: 200, "message": "Product updated successfully"})
        })

        //////////////////////////////// DELETE PRODUCT
        this.router.delete(`${this.path}/:pid`, async (req, res) => {
            const prodId = req.params.pid
            try {
                await this.manager.deleteProduct(prodId)
                res.json({status: 200, message: `Product: ${prodId} deleted`})
            } catch (err) {
                res.json({status: 400, message: "Error deleting product", err})
            }
        })

    }
}

module.exports = ProdsRouter;


