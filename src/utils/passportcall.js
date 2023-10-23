const passport = require("passport");

const passportCall = strategy => {
    return async(req, res, next) => {
        passport.authenticate(strategy, { session: false }, (err, user, info) => {
            if(err) return next(err)            ///si hay error, que termine el middleware devolviendolo
            if(!user) {
                if(strategy == "jwt") {         //en caso de que la estrategia sea JWT y no haya un usuario logeado, renderiza la vista
                    res.render("noAuthToken")
                    return
                }
                res.status(401).send({err: info.message ? info.message : info.toString()})
            } 
            
            req.user = user;
            next()
        })(req, res, next)
    }
}

module.exports = { passportCall }