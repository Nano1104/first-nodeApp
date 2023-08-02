const jwt = require('jsonwebtoken');

const { KEY_TOKEN } = require('../config/config.js');

const generateToken = (user) => {
    const token = jwt.sign({user}, KEY_TOKEN, {expiresIn: '6h'})
    return token;
}

module.exports = { generateToken }