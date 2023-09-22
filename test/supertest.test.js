const supertest = require("supertest");
const { expect } = require("chai");
const { PORT } = require("../src/config/config.js");

const BASE_URL = `http://localhost:${PORT}`;
const PRODS_URL = "/api/products"

describe('App Testing', () => {
    let requester;

    ///////////////////////////////////
    describe('Products Router Testing', () => {
        describe('Products Router POST', () => {
            it('POST api/products should create a product with status 200', async () => {
                requester = supertest(`${BASE_URL}${PRODS_URL}`)
                console.log(`${BASE_URL}${PRODS_URL}`)
                const bodyProd = {
                    title: "air max 270",
                    description: "nike sneaker",
                    code: "JDH",
                    price: 160,
                    stock: 10,
                    category: "SHIRT"
                }
                
                const { statusCode, ok, _body } = await requester.post(`${PRODS_URL}`).send(bodyProd);
                expect(statusCode).to.eq(200)
                expect(ok).to.be.ok
                expect(_body.status).to.eq("successs")
                expect(_body.payload).to.have.property("_id")
            })

            it('POST api/products should create a product without title with status 400', async () => {
                requester = supertest(`${BASE_URL}${PRODS_URL}`)
                const bodyProd = {
                    description: "nike sneaker",
                    code: "JDH",
                    price: 160,
                    stock: 10,
                    category: "SHIRT"
                }
                
                const { statusCode, ok, _body } = await requester.post(`${PRODS_URL}`).send(bodyProd);
                expect(statusCode).to.eq(400)
                expect(ok).to.be.false
                expect(_body.status).to.eq("error")
            })
            
            it('POST api/products should create a product with existing CODE with status 400', async () => {

            })
        })

        describe('Products Router GET BY ID', () => {
            
        })
    })

    ///////////////////////////////////
    describe('Carts Router Testing', () => {
        
    })
    ///////////////////////////////////
    describe('Sessions Router Testing', () => {
        
    })
}) 