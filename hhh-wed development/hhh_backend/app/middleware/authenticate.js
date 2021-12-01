let jwt = require('jsonwebtoken');
const config = require('../config/keys');

module.exports =(req, res, next) => {
  
    // Autherization header schema => Bearer <JWT token>
  let token = req.headers.authorization.split(" ")[1]; 

  if (token) {
    jwt.verify(token, config.jwtsecret, (err, decoded) => {
      if (err) {
        return res.json({
          done: false,
          message: 'Token is not valid'
        });
      } else {
        req.userData = decoded;
        next();
      }
    });
  } else {
    return res.json({
      done: false,
      message: 'Auth token is not supplied'
    });
  }
};
