const winston = require("winston")
const { NODE_ENV } = require("../config/config.js")

const customLevels = {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5
}

////// DEVELOPMENT LOGGER
const devLogger = winston.createLogger({
    levels: customLevels, 
    level: "debug",
    format: winston.format.simple(),
    transports: [new winston.transports.Console()]
});

////// PRODUCTION LOGGER
const prodLogger = winston.createLogger({
    levels: customLevels,
    format: winston.format.simple(),
    transports: [new winston.transports.File({ filename: './errors.log', level: 'error' })]
});

const loggerLevels = {
    production: prodLogger,
    development: devLogger
}

const setLogger = (req, res, next) => {
    req.logger = loggerLevels[`${NODE_ENV}`]
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}

module.exports = { setLogger }