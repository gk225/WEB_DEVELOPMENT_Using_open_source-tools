const sql = require("./db");
const bcrypt=require('bcrypt');

const User = function (user) {
  this.first_name = user.first_name;
  this.last_name = user.last_name;
  this.email = user.email;
  this.phone = user.phone;
  this.password = user.password;
};

User.create = async (newUser, result) => {
  const passwordd=newUser.password;
  const hashCost=10;
  newUser.password=await bcrypt.hash(passwordd,hashCost);
  sql.query(
    `SELECT * FROM users WHERE email= '${newUser.email}'`,
    (err, res) => {
      if (err) {
        console.log("error:", err);
        result(err, null);
        return;
      }
      if (res.length) {
        console.log("Users credentials already present in database");
        result({ message: "User present in database" }, null);
        return;
      } else if (!res.length) {
        sql.query("INSERT INTO hhh.users SET ?", newUser, (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }

          console.log("created user: ", { id: res.insertId });
          result(null, { message:"User added to database"});
        });
      }
    }
  );
};

User.verify = (checkUser, result) => {
  let email = checkUser.email;
  sql.query(`SELECT * FROM hhh.users where email = '${email}'`,async (err, res) => {
    if (err) {
       //console.log("error", err);
      result(err, { done: false });
      return;
    }
    if (res.length) {
      try{
      const passwordsMatch =await bcrypt.compare(checkUser.password,res[0].password)
      if (passwordsMatch) {
        console.log("signed in: ", { id: res[0].user_id });
      result(null, { done: true, id: res[0].user_id,email:res[0].email });
      } 
      else {
        result(null, { done: false });
      }
      }
      catch(error){
        console.log("error",error)
        result(error,{ done: false});
      } 
    } 
    else {
      result(null, { done: false });
    }
  });
};

User.findOrCreate=async (gUser,result)=>{
  const passwordd=gUser.password;
  const hashCost=10;
  gUser.password=await bcrypt.hash(passwordd,hashCost);
  sql.query(
    `SELECT * FROM users WHERE email= '${gUser.email}'`,
    (err, res) => {
      if (err) {
        console.log("error:", err);
        result(err, null);
        return;
      }
      if (res.length) {
        console.log("Users credentials already present in database");
        result(null, { done: true, id: res[0].user_id,email:res[0].email });
        return;
      } 
      else if (!res.length) {
        sql.query("INSERT INTO users SET ?", gUser, (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
          console.log(res)
          console.log("created user: ", { id: res.insertId });
        });
        sql.query(
          `SELECT * FROM users WHERE email= '${gUser.email}'`,
          (err, res) => {
            if (err) {
              console.log("error:", err);
              result(err, null);
              return;
            }
            if (res.length) {
              result(null, { done: true, id: res[0].user_id,email:res[0].email});
              return;
            }    
        });
      }
    }
  )
}
module.exports = User;
