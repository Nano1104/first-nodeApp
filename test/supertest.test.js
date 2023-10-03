const mongoose = require('mongoose');
const supertest = require("supertest");
const { expect } = require("chai");

//# VARIABLES
const { PORT, KEY_TOKEN } = require("../src/config/config.js");
const { mongoDBConnection, disconnectDB } = require('../src/db/mongoConfig.js');

//# MOCKS
const { testProd, testUser, testAdmin } = require("./testMocks.js");

//# MODELS
const productsModel = require("../src/models/products.model.js");
const cartsModel = require("../src/models/carts.model.js");
const userModel = require("../src/models/userModel.js");

//# URLS 
const BASE_URL = `http://localhost:${PORT}`;
const PRODS_URL = "/api/products"
const CARTS_URL = "/api/carts"
const SESSION_URL = "/api/session"

//TESTING
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

        it('POST api/products if the user has role "USER" should create a product with status 200', async () => {
            //# 1~ hacemos un register para luego hacer el login
            const { _body: bodyRegister } = await requester.post(`${SESSION_URL}/register`).send(testUser)
            
            //# 2~ hacemos el login con los datos del register para asi obtener el token
            const userLogin = {
                email: bodyRegister.user.email,
                password: bodyRegister.user.password
            }
            const { _body: bodyLogin } = await requester.post(`${SESSION_URL}/login`).send(userLogin)

            //# 3~ creamos un prod y ahora lo creamos con el token generado para el permiso en la route
            const { statusCode, _body } = await requester.post(`${PRODS_URL}`).send(testProd)
                                                                                  .set('Cookie', `userToken=${bodyLogin.token}`)
            expect(statusCode).to.be.eq(200)
            expect(_body.message).to.be.eq("Product added successfully")
            expect(_body.result).to.have.property("_id")
        })

        it('GET api/products/:pid should get product by Id with status 200', async () => {
            //# 1~ registramos e iniciamos sesion con un usuario con role "USER" para poder agregar un prod a la db
            //register
            const { _body: bodyRegister } = await requester.post(`${SESSION_URL}/register`).send(testUser)
            //login
            const userLogin = {
                email: bodyRegister.user.email,
                password: bodyRegister.user.password
            }
            const { _body: bodyLogin } = await requester.post(`${SESSION_URL}/login`).send(userLogin)
            const { _body: prodAddedBody } = await requester.post(`${PRODS_URL}`).send(testProd)
                                                                                 .set('Cookie', `userToken=${bodyLogin.token}`)
            expect(prodAddedBody).to.be.ok
            expect(prodAddedBody.result).to.have.property('_id')

            //# 2~ tomamos el id del prod creado y lo buscamos. Si toda esta correcto deberia encontrarlo
            const prodIdToFind = prodAddedBody.result._id
            const { _body: prodFoundBody } = await requester.get(`${PRODS_URL}/${prodIdToFind}`)
            expect(prodFoundBody.message).to.be.eq("Success getting product")
            expect(prodFoundBody).to.be.ok
            expect(prodFoundBody.product).to.have.property('_id')
        })

        it('DELETE api/products/:pid if the user has "ADMIN" role should delete product by Id with status 200', async () => {
            //# 1~ registramos e iniciamos sesion con un usuario con role "USER" para poder agregar un prod a la db
            const { _body: bodyRegister } = await requester.post(`${SESSION_URL}/register`).send(testUser)
            //login
            const userLogin = {
                email: bodyRegister.user.email,
                password: bodyRegister.user.password
            }
            const { _body: bodyLogin } = await requester.post(`${SESSION_URL}/login`).send(userLogin)
            //product added
            const { statusCode, ok, _body: prodAddedBody } = await requester.post(`${PRODS_URL}`)
                                                                    .set('Cookie', `userToken=${bodyLogin.token}`)
                                                                    .send(testProd);
            expect(statusCode).to.be.eq(200)
            expect(prodAddedBody.message).to.be.eq("Product added successfully")
            expect(prodAddedBody.result).to.have.property("_id")
            const prodIdToFind = prodAddedBody.result._id

            //# 2~ ahora registraremos e iniciaremos sesion con un usuario con role "ADMIN"
            const { _body: adminRegisterBody } = await requester.post(`${SESSION_URL}/register`).send(testAdmin)
            expect(adminRegisterBody.message).to.be.eq("Successful register")
            expect(adminRegisterBody.user).to.have.property("email")
            expect(adminRegisterBody.user.email).to.be.eq("adminCoder@hotmail.com")

            const adminLogin = {
                email: adminRegisterBody.user.email,
                password: adminRegisterBody.user.password
            }
            const { _body: adminLoginBody } = await requester.post(`${SESSION_URL}/login`).send(adminLogin)
            expect(adminLoginBody.message).to.be.eq("User login successfully with Token")
            expect(adminLoginBody.token).to.not.be.undefined

            //# 3~ Ahora con el token generado para el ADMIN, podremos eliminar el prod de la db
            const { statusCode: statusDelete, _body: prodDeletedBody } = await requester.delete(`${PRODS_URL}/${prodIdToFind}`)
                                                              .set('Cookie', `userToken=${adminLoginBody.token}`)
            expect(statusDelete).to.be.eq(200)
            expect(prodDeletedBody.message).to.be.eq("Product deleted successfully")
        })
    })

    ///////////////////////////////////
    describe('Carts Router Testing', () => {
        afterEach(async () => {
            await cartsModel.deleteMany({})
            await productsModel.deleteMany({})
            await userModel.deleteMany({})
        })

        it('POST api/:cid/products/:pid should post a ceartain product in a certain cart with status 200', async () => {
            //# 1~ creamos un cart de prueba y accedemos a su _id 
            const { _body: cartCreatedBody } = await requester.post(`${CARTS_URL}`)
            expect(cartCreatedBody.newCart).to.have.property("_id")
            expect(cartCreatedBody.message).to.be.eq("Cart created successfully")
            const cartId = cartCreatedBody.newCart._id

            //# 2~ registramos e iniciamos session con un user para agregar un prod a la db
            //register
            const { _body: bodyRegister } = await requester.post(`${SESSION_URL}/register`).send(testUser)
            //login
            const userLogin = {
                email: bodyRegister.user.email,
                password: bodyRegister.user.password
            }
            const { _body: bodyLogin } = await requester.post(`${SESSION_URL}/login`).send(userLogin)

            const { _body: prodAddedBody } = await requester.post(`${PRODS_URL}`)
                                                                    .set('Cookie', `userToken=${bodyLogin.token}`)
                                                                    .send(testProd);
            expect(prodAddedBody.result).to.be.ok
            expect(prodAddedBody.result).to.have.property("_id")
            const prodId = prodAddedBody.result._id

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

            //# 2~ registramos e iniciamos session con un user para agregar un prod a la db y acceder a su _id
            //register
            const { _body: bodyRegister } = await requester.post(`${SESSION_URL}/register`).send(testUser)
            //login
            const userLogin = {
                email: bodyRegister.user.email,
                password: bodyRegister.user.password
            }
            const { _body: bodyLogin } = await requester.post(`${SESSION_URL}/login`).send(userLogin)
            expect(bodyLogin).to.be.ok
            const { _body: prodAddedBody } = await requester.post(`${PRODS_URL}`)
                                                                    .set('Cookie', `userToken=${bodyLogin.token}`)
                                                                    .send(testProd);
            expect(prodAddedBody.result).to.be.ok
            expect(prodAddedBody.result).to.have.property("_id")
            const prodId = prodAddedBody.result._id

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
        afterEach(async () => {
            await productsModel.deleteMany({})
            await userModel.deleteMany({})
         })
        
        it('POST api/session/register should not register user without first_name with status 500', async () => {
            const registerMock = {
                age: 19,
                email: "mariannfer04@gmail.com",
                phone: 1128483938,
                password: '123',
            }
            const { statusCode, _body: bodyRegister } = await requester.post(`${SESSION_URL}/register`).send(registerMock)
            expect(statusCode).to.be.eq(500)
            expect(bodyRegister.message).to.be.eq("Registration failed")
            expect(bodyRegister.error).to.be.ok
        })

        it('POST api/session/register should not register user with existing email with status 500', async () => {
            //# 1~ hacemos un register
            const { _body: bodyRegister } = await requester.post(`${SESSION_URL}/register`).send(testUser)

            //# 2~ hacemos nuevamente un register que tenga el mismo email
            const { statusCode, _body: bodyRegister2 } = await requester.post(`${SESSION_URL}/register`).send(testUser)
            expect(statusCode).to.be.eq(500)
            expect(bodyRegister2.message).to.be.eq("Registration failed")
            expect(bodyRegister2.error).to.be.ok
        })

        it('POST api/session/login should not login user with different password status 500', async () => {
            //# 1~ hacemos un register para luego hacer el login
            const { _body: bodyRegister } = await requester.post(`${SESSION_URL}/register`).send(testUser)
            expect(bodyRegister.message).to.be.eq("Successful register")

            //# 2~ hacemos el login con un email que no existe
            const mockLogin = {
                email: bodyRegister.user.email,
                password: '123-coder'
            }
            const { statusCode, _body: bodyLogin } = await requester.post(`${SESSION_URL}/login`).send(mockLogin)
            expect(statusCode).to.be.eq(401)
            expect(bodyLogin.message).to.be.ok
            expect(bodyLogin.message).to.be.eq("password incorrect")
        })
    })
}) 



/* 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 */


