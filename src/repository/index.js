const { Products } = require("../dao/factory.js");
const ProductsRepositoryDao = require("./products.repository.js");

const ProductsServiceDao = new ProductsRepositoryDao(Products)

module.exports = {
    ProductsServiceDao
}