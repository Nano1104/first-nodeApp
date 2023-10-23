const authRole = (...roles) => {
    return async(req, res, next) => {
        if(!req.user) return res.status(401).send({err: "Unathorized, there's no user"})
        /* if(req.user.user.role != role) return res.status(403).send({err: "No permissions, this user has another role"}) */
        const userRole = req.user.user.role;
        if (!roles.includes(userRole)) {
            return res.status(403).send({ err: "No permissions, this user has another role" });
        }
        next()
    }
}



module.exports = { authRole }