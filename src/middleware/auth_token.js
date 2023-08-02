const jwt = require('jsonwebtoken');

const { KEY_TOKEN } = require('../config/config.js');

const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader) return res.status(401).send({err: "Not authenticated"})

    const token = authHeader.split(' ')[1]
    jwt.verify(token, KEY_TOKEN, (err, credentials) => {
        if(err) return res.status(403).send({err: "Not authorized"})

        req.user = credentials.user
        req.token = token
        next()
    })
}

module.exports = { authToken }