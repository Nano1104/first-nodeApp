const { PERSISTENCE } = require("../config/config.js");
const { mongoDBConnection } = require('../db/mongoConfig.js');
let Products;
let Carts;

const initializeAppPersistence = () => {
    switch(PERSISTENCE) {
        case "mongo":
            mongoDBConnection();
            const ProductsMongoDao = require('./mongo/products.mongo.js');
            const CartsMongoDao = require("./mongo/carts.mongo.js");
            Products = new ProductsMongoDao()
            Carts = new CartsMongoDao()
            break;
    
        default:
            const ProductsMemDao = require('./memory/products.memory.js');
            const CartsMemoDao = require("./memory/carts.memory.js");
            Products = new ProductsMemDao()
            Carts = new CartsMemoDao()
            break;
    }
}

initializeAppPersistence();

module.exports = {
    Products,
    Carts
}