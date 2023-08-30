const jwt = require('jsonwebtoken');

const { KEY_TOKEN } = require('../config/config.js');

const generateToken = (user) => {
    const token = jwt.sign({user}, KEY_TOKEN, {expiresIn: '6h'})
    return token;
}

const cookieExtractor = req => {
    let token = null;
    if(req && req.cookies) token = req.cookies['userToken']
    
    return token
}

module.exports = { generateToken, cookieExtractor }