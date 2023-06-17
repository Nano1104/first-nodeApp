const { config } = require('dotenv');

config({
    path: `.env.${process.env.NODE_ENV || "development"}`
})

const {
    API_VERSION,
    NODE_ENV,
    PORT,
    ORIGIN,
    DB_CNN,
    DB_HOST,
    DB_NAME,
    DB_PORT,
    DB_USER,
    DB_PASSWORD
} = process.env

module.export = {
    API_VERSION,
    NODE_ENV,
    PORT
}