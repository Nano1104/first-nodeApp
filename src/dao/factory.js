const { PERSISTENCE } = require("../config/config.js");
const { mongoDBConnection } = require('../db/mongoConfig.js');
let Products;

const initializeAppPersistence = async () => {
    switch(PERSISTENCE) {
        case "MONGO":
            console.log(`PERSISTENCE: ${PERSISTENCE}`);
            await mongoDBConnection();
            const ProductsMongoDao = require('./mongo/products.mongo.js');
            Products = ProductsMongoDao
            console.log(Products)
            break;
    
        default:
            console.log(`PERSISTENCE: ${PERSISTENCE}`);
            const ProductsMemDao = require('./memory/products.memory.js');
            Products = ProductsMemDao
            break;
    }
}

initializeAppPersistence();

module.exports = { Products }