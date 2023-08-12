const { Products } = require("../dao/factory.js");
const ProductsServiceDao = require("../services/products.service.js");
const productsModel = require("../models/products.model.js");

class ProductsController {
    productsService;
    constructor() {
        this.productsService = new ProductsServiceDao(new Products);  //hacemos una instancia del manager de products para usarlo como service en el controller
    }

    getProducts = async (req, res) => {
        const sortVal = (sort) => {             //defina el valor del sort dependiendo si es 'asc' o 'desc'
            let sortLow = sort.toLowerCase();
            if(sortLow === 'asc') {
                return { price: 1 }
            } else if(sortLow === 'desc') {
                return { price: -1 }
            }
        }

        try {
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
            
            res.status(200).json({
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
        } catch (err) {
            res.status(400).json({message: "Error getting product", err: err})
        }
    }

    getProductById = async (req, res) => {
        try {
            const product = await this.productsService.getProductById(req.params.pid)
            res.status(200).json({message: "Success getting product", product: product})
        } catch (err) {
            res.status(400).json({message: "Error getting product", err: err})
        }
        
    }

    creatProduct = async (req, res) => {
        try {
            const product = req.body
            await this.productsService.creatProduct(product)
            res.status(200).json({message: "Product added successfully"})
        } catch(err) {
            res.status(400).json({message: "Error creating product, some fields may be empty", err: err})
        }
    }

    updateProduct = async (req, res) => {  //VERIFICAR SI NO EXISTE EL PROD CON EL ID
        try {
            const update = req.body
            await this.productsService.updateProduct(req.params.pid, update)
            res.status(200).json({message: "Product updated successfully"})
        } catch (err) {
            res.status(400).json({message: "Error updating product", err: err})
        }
    }

    deleteProduct = async (req, res) => {
        try {
            await this.productsService.deleteProduct(req.params.pid)
            res.status(200).json({message: "Product deleted successfully"})
        } catch (err) {
            res.status(400).json({message: "Error deleting product", err: err})
        }
    }
}

module.exports = ProductsController;