const passport = require("passport");

const passportCall = strategy => {
    return async(req, res, next) => {
        passport.authenticate(strategy, (err, user, info) => {
            if(err) return next(err)            ///si hay error, que termine el middleware devolviendolo
            if(!user) return res.status(401).send({err: info.message ? info.message : info.toString()}) 

            req.user = user;
            next()
        })(req, res, next)
    }
}

module.exports = { passportCall }