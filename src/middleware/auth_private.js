const authPrivate = (req, res, next) => {
    try {
      if (req.session.user) return next() 
      throw 'No tiene una session'
    } catch (error) {
      res.redirect('/login')
    }
  }
  
module.exports = { authPrivate }
