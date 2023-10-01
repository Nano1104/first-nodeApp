const mongoose = require('mongoose');
const supertest = require("supertest");
const { expect } = require("chai");

//# VARIABLES
const { PORT, KEY_TOKEN } = require("../src/config/config.js");
const { mongoDBConnection, disconnectDB } = require('../src/db/mongoConfig.js');

//# MODELS
const productsModel = require("../src/models/products.model.js");
const cartsModel = require("../src/models/carts.model.js");
const userModel = require("../src/models/userModel.js");

//# URLS 
const BASE_URL = `http://localhost:${PORT}`;
const PRODS_URL = "/api/products"
const CARTS_URL = "/api/carts"
const SESSION_URL = "/api/session"

//# MOCKS
const testProd = {
    title: "air max 270",
    description: "nike sneaker",
    code: "JDH",
    price: 160,
    stock: 10,
    category: "SHIRT"
}

describe('App Testing', () => {
    let requester;
    before(() => {
        requester = supertest(`${BASE_URL}`)
        mongoDBConnection()
    })

    after(() => disconnectDB())

    ///////////////////////////////////
    describe('Products Router Testing', () => {
        afterEach(async () => {
           await productsModel.deleteMany({})
           await userModel.deleteMany({})
        })

        it.only('POST api/products if the user has role "USER" should create a product with status 200', async () => {
            //# 1~ hacemos un register para luego hacer el login
            const mockRegister = {
                first_name: "mariano",
                last_name: "fernandez",
                age: 19,
                email: "mariannfer04@gmail.com",
                phone: 1128483938,
                password: '123',
            }
            const { _body: bodyRegister } = await requester.post(`${SESSION_URL}/register`).send(mockRegister)
            console.log(bodyRegister)
            
            //# 2~ hacemos el login con los datos del register para asi obtener el token
            const mockLogin = {
                email: bodyRegister.user.email,
                password: bodyRegister.user.password
            }
            const { _body: bodyLogin } = await requester.post(`${SESSION_URL}/login`).send(mockLogin)
            console.log(bodyLogin.token)

            //# 3~ creamos un prod y ahora lo creamos con el token generado para el permiso en la route
            const mockProd = {
                title: "air max 270",
                description: "nike sneaker",
                code: "JDH",
                price: 160,
                stock: 10,
                category: "SHIRT"
            }

            const { statusCode, ok, _body } = await requester.post(`${PRODS_URL}`)
                                                                    .set('Cookie', [`'userToken'=${bodyLogin.token}`])
                                                                    .send(mockProd);
            console.log(_body)
        })

        it('GET api/products/:pid should get product by Id with status 200', async () => {
            //# 1~ agregamos un prod a la db de prueba
            const mockProd = {
                title: "air max 270",
                description: "nike sneaker",
                code: "JDH",
                price: 160,
                stock: 10,
                category: "SHIRT"
            }
            const { _body: prodAddedBody } = await requester.post(`${PRODS_URL}`).send(mockProd)
            expect(prodAddedBody).to.be.ok
            expect(prodAddedBody.result).to.have.property('_id')

            //# 2~ tomamos el id del prod creado y lo buscamos. Si toda esta correcto deberia encontrarlo
            const prodIdToFind = prodAddedBody.result._id
            const { _body: prodFoundBody } = await requester.get(`${PRODS_URL}/${prodIdToFind}`)
            expect(prodFoundBody.message).to.be.eq("Success getting product")
            expect(prodFoundBody).to.be.ok
            expect(prodFoundBody.product).to.have.property('_id')
        })

        it('DELETE api/products/:pid should delete product by Id with status 200', async () => {
            //# 1~ agregamos un prod a la db de prueba
            const mockProd = {
                title: "air max 270",
                description: "nike sneaker",
                code: "JDH",
                price: 160,
                stock: 10,
                category: "SHIRT"
            }
            const { _body: prodAddedBody } = await requester.post(`${PRODS_URL}`).send(mockProd)
            expect(prodAddedBody.result).to.be.ok
            expect(prodAddedBody.result).to.have.property('_id')

            //# 2~ con el id del prod agregado, lo eliminamos de la db
            const prodIdToFind = prodAddedBody.result._id
            const { _body: prodDeletedBody } = await requester.delete(`${PRODS_URL}/${prodIdToFind}`)
            expect(prodDeletedBody.message).to.be.eq("Product deleted successfully hola")
        })
    })

    ///////////////////////////////////
    describe('Carts Router Testing', () => {
        afterEach(async () => {
            await cartsModel.deleteMany({})
            await productsModel.deleteMany({})
        })

        it('POST api/:cid/products/:pid should post a ceartain product in a certain cart with status 200', async () => {
            //# 1~ creamos un cart de prueba y accedemos a su _id 
            const { _body: cartCreatedBody } = await requester.post(`${CARTS_URL}`)
            expect(cartCreatedBody.newCart).to.have.property("_id")
            expect(cartCreatedBody.message).to.be.eq("Cart created successfully")
            const cartId = cartCreatedBody.newCart._id

            //# 2~ creamos un prod en la db y accedemos a su _id
            const { _body: prodCreatedBody } = await requester.post(`${PRODS_URL}`).send(testProd)
            expect(prodCreatedBody.result).to.be.ok
            expect(prodCreatedBody.result).to.have.property("_id")
            const prodId = prodCreatedBody.result._id

            //# 3~ agregamos el prod creado al carrito
            const { _body: cartModified } = await requester.post(`${CARTS_URL}/${cartId}/products/${prodId}`)
            expect(cartModified).to.be.ok
            expect(cartModified.cart).to.have.property("_id")
            expect(cartModified.cart.products).to.be.an("array")
        })

        it('GET api/carts/:cid should not get products from cart using wrong _id with status 400', async () => {
            //# 1~ creamos un cart y accedemos a su _id
            const { _body: cartCreatedBody } = await requester.post(`${CARTS_URL}`)
            expect(cartCreatedBody.newCart).to.have.property("_id")
            expect(cartCreatedBody.message).to.be.eq("Cart created successfully")
            const cartId = cartCreatedBody.newCart._id
            
            //# 2~ creamos y pasamos un _id incorrecto (en este caso el _id se pasara como number)
            const falsyId = parseInt(cartId)
            const { statusCode, _body: errorBody } = await requester.get(`${CARTS_URL}/${falsyId}`)
            expect(statusCode).to.be.eq(400)
            expect(errorBody).to.have.property("err")
        })

        it('DELETE api/carts/:cid should delete all products from cart with status 200', async () => {
            //# 1~ creamos un cart de prueba y accedemos a su _id 
            const { _body: cartCreatedBody } = await requester.post(`${CARTS_URL}`)
            expect(cartCreatedBody.newCart).to.have.property("_id")
            expect(cartCreatedBody.message).to.be.eq("Cart created successfully")
            const cartId = cartCreatedBody.newCart._id

            //# 2~ creamos un prod en la db y accedemos a su _id
            const { _body: prodCreatedBody } = await requester.post(`${PRODS_URL}`).send(testProd)
            expect(prodCreatedBody.result).to.be.ok
            expect(prodCreatedBody.result).to.have.property("_id")
            const prodId = prodCreatedBody.result._id

            //# 3~ agregamos el prod creado al carrito
            const { _body: cartModified } = await requester.post(`${CARTS_URL}/${cartId}/products/${prodId}`)
            expect(cartModified).to.be.ok
            expect(cartModified.cart).to.have.property("_id")
            expect(cartModified.cart.products).to.be.an("array").that.is.not.empty

            //# 4~ ahora vaciamos el array de products del cart
            const { statusCode, _body: emptyCart } = await requester.delete(`${CARTS_URL}/${cartId}`)
            expect(statusCode).to.be.eq(200)
            expect(emptyCart.result._id).to.be.eq(`${cartId}`)
            expect(emptyCart.result.products).to.be.an("array").that.is.empty
        })
    })

    ///////////////////////////////////
    describe('Sessions Router Testing', () => {
        
    })
}) 



/* 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 */