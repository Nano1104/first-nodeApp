const { Products, Carts } = require("../dao/factory.js");
const ProductsRepositoryDao = require("./products.repository.js");
const CartsRepositoryDao = require("./carts.repository.js");

const ProductsServiceDao = new ProductsRepositoryDao(Products)
const CartsServiceDao = new CartsRepositoryDao(Carts)

module.exports = {
    ProductsServiceDao,
    CartsServiceDao
}