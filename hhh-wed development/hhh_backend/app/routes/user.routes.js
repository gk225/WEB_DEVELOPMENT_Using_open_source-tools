let passport=require('passport');
const users=require('../controllers/user.controller');
module.exports = (app) => {
 
  // Create a new User
  // ! route
  app.post("/users", users.create);

  // ! route
  app.post("/signin", users.verify);
   
  users.oauth(passport);

  // ! Google OAuth route
  app.get('/auth/google',
  passport.authenticate('google', { scope: 
      [ 'https://www.googleapis.com/auth/plus.login',
      , 'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile' ] },
      {session:false}
  ));

  // ! Google OAuth callback route
  app.get('/auth/google/callback',function(req, res) {
      passport.authenticate(
        'google',
        {session:false},  
        (error,user)=>{         
          if(error)
          {
            res.status(500).send({message:error.message||"Some error occurred while signing the user."})
          }
          if(!user){
            res.status(400).send({
              message: "Content can not be empty!",
            });
          }
          else{
          console.log("data inside Google OAuth",user)
          res.cookie('token', user.token)
          res.redirect('http://localhost:3000/signin')
          }
        }
      )(req,res)
    });

  // ! Spotify OAuth route
  app.get('/auth/spotify',passport.authenticate('spotify', {
  scope: ['user-read-email']
  },{session:false}), function(req, res) {
  });
  

  // ! Spotify OAuth callback route
  app.get(
    '/auth/spotify/callback',
    function(req, res) {
      passport.authenticate(
        'spotify',
        {session:false},  
        (error,user)=>{
          if(error)
          {
            res.status(500).send({message:error.message||"Some error occurred while signing the user."})
          }
          if(!user){
            res.status(400).send({
              message: "Content can not be empty!",
            });
          }
          else{
          console.log("data inside Spotify OAuth",user)
          res.cookie('token', user.token)
          res.redirect('http://localhost:3000/signin')
          }
        }
      )(req,res)
    }
  );
  // Retrieve all Users
  //app.get("users", users.findAll);

  // Retrieve a single user with userId
  //app.get("/users/:userId", users.findOne);

  // Update a User with userId
  //app.put("/users/:userId", users.update);

  // Delete a User with userId
  //app.delete("/users/:userId", users.delete);

  // Create a new User
  //app.delete("/users", users.deleteAll);
};
