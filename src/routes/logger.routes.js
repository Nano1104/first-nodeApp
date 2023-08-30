const { Router } = require("express");

class LoggerRouter {
    constructor() {
        this.path = "/logger"
        this.router = Router()
        this.initProdsRoutes();
    }

    initProdsRoutes() {
        this.router.get(`${this.path}/loggerTest`, async (req, res) => {
            req.logger.debug('Debug message');
            req.logger.http('HTTP message');
            req.logger.info('Info message');
            req.logger.warning('Warning message');
            req.logger.error('Error message');
            req.logger.fatal('Fatal message');
        
            res.send('Logs printed in the console/file.');
        })
    }
}

module.exports = LoggerRouter