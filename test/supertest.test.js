const mongoose = require('mongoose');
const supertest = require("supertest");
const { expect } = require("chai");

//# VARIABLES
const { PORT, KEY_TOKEN } = require("../src/config/config.js");
const { mongoDBConnection, disconnectDB } = require('../src/db/mongoConfig.js');

//# MODELS
const productsModel = require("../src/models/products.model.js");
const userModel = require("../src/models/userModel.js");

//# URLS 
const BASE_URL = `http://localhost:${PORT}`;
const PRODS_URL = "/api/products"
const CARTS_URL = "/api/carts"
const SESSION_URL = "/api/session"

describe('App Testing', () => {
    let requester;
    before(() => mongoDBConnection())

    after(() => disconnectDB())

    ///////////////////////////////////
    describe('Products Router Testing', () => {
        afterEach(async () => {
           await productsModel.deleteMany({})
           await userModel.deleteMany({})
        })

        it('POST api/products if the user has role "USER" should create a product with status 200', async () => {
            requester = supertest(`${BASE_URL}`)
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
            const bodyProd = {
                title: "air max 270",
                description: "nike sneaker",
                code: "JDH",
                price: 160,
                stock: 10,
                category: "SHIRT"
            }

            const { statusCode, ok, _body } = await requester.post(`${PRODS_URL}`)
                                                                    .set('Cookie', [`${KEY_TOKEN}=${bodyLogin.token}`])
                                                                    .send(bodyProd);
            console.log(_body)
        })

        /* it('GET api/products/:pid should get product by Id with status 200', async () => {

        })

        it('DELETE api/products/:pid should delete product by Id with status 200', async () => {

        }) */
    })

    ///////////////////////////////////
    describe('Carts Router Testing', () => {
        
    })
    ///////////////////////////////////
    describe('Sessions Router Testing', () => {
        
    })
}) 



