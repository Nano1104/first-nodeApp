//////// DAOS
const { Products, Carts } = require("../dao/factory.js");
//////// REPOSITORIES
const ProductsRepositoryDao = require("../repository/products.repository.js");
const CartsRepositoryDao = require("../repository/carts.repository.js");

//////// SERVICES
const ProductsServiceDao = new ProductsRepositoryDao(Products)
const CartsServiceDao = new CartsRepositoryDao(Carts)

module.exports = {
    ProductsServiceDao,
    CartsServiceDao
}