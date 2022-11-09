require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    //Get token from header
    const token  = req.header('x-auth-token');
    console.log(token);
    //check if no token
    if(!token) {
        return res.status(401).json({
          msg: 'No token. Authorization Denied'
        })
    }
    //if token, verify
    try {

        const decoded = jwt.verify(token, process.env.JWTSECRET);
        console.log(decoded);
        req.user = decoded.user;

        next();

    } catch (err) {
        res.status(401).json({
          msg: 'Token is not valid.'
        })
    }
}
