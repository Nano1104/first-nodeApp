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
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    CLIENT_ID,
    CLIENT_SECRET,
    KEY_TOKEN,
    PERSISTANCE
} = process.env

module.exports = {
    API_VERSION,
    NODE_ENV,
    DB_CNN,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    CLIENT_ID,
    CLIENT_SECRET,
    KEY_TOKEN,
    PERSISTANCE
}