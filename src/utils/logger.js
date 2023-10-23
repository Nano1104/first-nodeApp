const winston = require("winston")
const { NODE_ENV } = require("../config/config.js")

////// DEVELOPMENT LOGGER
const devLogger = winston.createLogger({
    levels: winston.config.npm.levels, 
    level: "debug",
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [new winston.transports.Console()]
});

////// PRODUCTION LOGGER
const prodLogger = winston.createLogger({
    levels: winston.config.npm.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
      ]
});

const loggerLevels = {
    production: prodLogger,
    development: devLogger
}

const setLogger = (req, res, next) => {     //dependiendo el entorno, setea el logger de dev o production
    req.logger = loggerLevels[`${NODE_ENV}`]
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}

module.exports = { setLogger }