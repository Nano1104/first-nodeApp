const authRole = role => {
    return async(req, res, next) => {
        if(!req.user) return res.status(401).send({err: "Unathorized"})
        if(req.user.user.role != role) return res.status(403).send({err: "No permissions"})
        next()
    }
}

module.exports = { authRole }