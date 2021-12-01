const User = require("../models/user.model.js");
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;
const jwt=require('jsonwebtoken');
const config=require("../config/keys")
// Create and Save a new uer

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const user = new User({
    email: req.body.user.email,
    first_name: req.body.user.first_name,
    last_name: req.body.user.last_name,
    password: req.body.user.password,
    phone: req.body.user.phone,
  });

  // Save user in the database
  User.create(user, (err, data) => {
    if (err) {
      if (err.message === "User present in database") {
        console.log("Present in database");
        res.status(418).send({
          message: err.message,
        });
        return;
      } else {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the user.",
        });
      }
    } else {
      res.send(data);
    }
  });
};


exports.verify = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const user = new User({
    email: req.body.user.email,
    password: req.body.user.password,
  });
  User.verify(user, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while signing the user.",
      });
    else {
      console.log("data in verify", data);
      if(data.done){
        const token = jwt.sign(
          {
            id: data.id,
            email:data.email
          },
          config.jwtsecret,
          {
             expiresIn: '24h' // expires in 24 hours
          }
        );
      console.log("token:",token);
      res.send({
        "done":data.done,
        "id":data.id,
        "email":data.email,
        "token":token
       });
      }
      else{
      res.send(data)
      }
    }
  });
};
exports.oauth=function(passport){
  passport.use(new GoogleStrategy({
    clientID: config.GoogleClientID,
    clientSecret: config.GoogleClientSecret,
    callbackURL: "http://localhost:5000/auth/google/callback",
    passReqToCallback: true
  },
  function(req,accessToken, refreshToken, profile, done) {
    if (!req.body) {
      return done(null,null);
    }
    console.log(profile)
    const user = new User({
      email:profile.email,
      first_name: profile.given_name,
      last_name: profile.family_name,
      password: profile.id
    });
    User.findOrCreate(user,(err,data)=>{
      if(err){ 
        return done(err);
      }
      else{
        console.log(data)
        if(data.done){
          const token = jwt.sign(
            {
              id: data.id,
              email:data.email
            },
            config.jwtsecret,
            {
               expiresIn: '24h' // expires in 24 hours
            }
          );
        console.log("token:",token);
        return done(null,{
          "done":data.done,
          "id":data.id,
          "email":data.email,
          "token":token
         });
        }
        else return(done,data)
      }
    });
  })
  );

  passport.use(
    new SpotifyStrategy(
      {
        clientID: config.SpotifyClientID,
        clientSecret: config.SpotifyClientSecret,
        callbackURL: 'http://localhost:5000/auth/spotify/callback',
        passReqToCallback: true
      },
      function(req,accessToken, refreshToken, expires_in, profile, done) {
        if (!req.body) {
          return done(null,null);
        }
        const user = new User({
          email:profile.emails[0].value,
          first_name: profile.username,
          last_name: profile.displayName,
          password: profile.id
        });
        User.findOrCreate(user,(err,data)=>{
          if(err){ 
            return done(err);
          }
          else{
            console.log(data)
            if(data.done){
              const token = jwt.sign(
                {
                  id: data.id,
                  email:data.email
                },
                config.jwtsecret,
                {
                   expiresIn: '24h' // expires in 24 hours
                }
              );
            console.log("token:",token);
            return done(null,{
              "done":data.done,
              "id":data.id,
              "email":data.email,
              "token":token
             });
            }
            else return(done,data)
          }
        });
      }
    )
  );
}