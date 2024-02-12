const jwt = require('jsonwebtoken');
const UserModel = require('../Models/user')


const checkUserAuth = async (req, res, next) => {
    // console.log("middleware auth")
    const { token } = req.cookies;// token get //
    // console.log(token)
    if (!token) {
        req.flash('error', 'Unauthorized Login')
        res.redirect('/')
    } else {
        const data = jwt.verify(token, 'nikhilqwertyuisdfghjkzxcvbn');
        //data get//
        const userdata = await UserModel.findOne({ _id: data.ID })
        // console.log(userdata);
        req.userdata = userdata
        next();
    }
};
module.exports = checkUserAuth; 