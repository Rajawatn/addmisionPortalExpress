const jwt = require('jsonwebtoken')


const authRoles = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userdata.role)) {
            req.flash('error', 'unauthorised user please login')
            res.redirect('/')
        }
        next()
    }
}
module.exports = authRoles