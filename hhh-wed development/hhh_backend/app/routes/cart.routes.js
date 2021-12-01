const checkToken=require('../middleware/authenticate');
module.exports = (app, connectio) => {
  // ! route
  app.post("/cart", checkToken, (req, res) => {
    let data = req.body;
    userData=req.userData;
    console.log("data in req in cart1", data);
    // // details:(Object containing essential credentials)
    // // data.details.user_id
    // // data.details.merch_id
    // // data.details.quantity
    // // data.details.merch_limit
    if (data.message === "insert") {
      connectio.query(
        `SELECT * FROM merchandise_cart WHERE user_id=(SELECT user_id from users where users.email='${userData.email}') and merch_id=${data.details.merch_id}`,
        (err, res1) => {
          // // console.log("res in cart1", res);
          if (err) {
            console.log("error in sql query 1 ");
          } else {
            console.log(res1.length);
            if (res1.length === 0) {
              connectio.query(
                `INSERT INTO merchandise_cart(user_id, merch_id, quantity) values ((SELECT user_id from users WHERE email='${userData.email}'), ${data.details.merch_id}, ${data.details.quantity})`,
                (err, rws) => {
                  if (err) console.log("error in sql query 2 ");
                  app.post("/checkout/merchandise");
                  console.log("inserted in cart");
                }
              );
              res.send("Item added to cart");
              return;
            } else {
              // // console.log(res1[0].quantity);
              let quantity = res1[0].quantity;
              // quantity += data.details.quantity;
              if (quantity + data.details.quantity > data.details.merch_limit) {
                quantity = data.details.merch_limit;
              } else {
                quantity = quantity + data.details.quantity;
              }
              connectio.query(
                `UPDATE merchandise_cart SET quantity=${quantity} WHERE user_id=(SELECT user_id from users where users.email='${userData.email}') and merch_id=${data.details.merch_id}`,
                (err, res1) => {
                  if (err) {
                    console.log("quantity not updated");
                  } else {
                    res.send("Item added to cart");
                  }
                }
              );

              return;
            }
          }
        }
      );
    }
    if (data.message === "view") {
      
      connectio.query(
        `SELECT m.merch_id, p.merch_limit, p.price AS individual_price, p.merch_name, p.image_url, m.quantity, p.price*m.quantity AS price
        FROM merch p, merchandise_cart m 
        WHERE m.user_id=(SELECT user_id FROM users WHERE email='${userData.email}') and m.merch_id=p.merch_id`,
        (err, resu) => {
          if (err) throw err;
          if (resu) {
            res.send(resu);
          }
          if (!resu) {
            res.send("cart is empty");
          }
        }
      );
    }
  });

  // ! route

  app.post("/decrementCart",checkToken, (req, res) => {
    const userData=req.userData
    connectio.query(
      `SELECT * FROM merchandise_cart WHERE user_id=(SELECT user_id from users WHERE email='${userData.email}') and merch_id='${req.body.body.merch_id}'`,
      (err, res1) => {
        // console.log(res1);
        if (err) console.log("error in decrementCart");
        else {
          if (res1.length > 0) {
            let json = JSON.parse(JSON.stringify(res1));
            let tempQuantity = res1[0].quantity;
            if (tempQuantity > 1) {
              connectio.query(
                `UPDATE merchandise_cart SET quantity=${
                  tempQuantity - 1
                } WHERE cart_item_id=${res1[0].cart_item_id}`,
                (err, res2) => {
                  if (err) {
                    console.log("error in query2");
                    // res.send("error in query 2");
                  } else {
                    // res.send("decremented successfully!");
                  }
                }
              );
            } else {
              connectio.query(
                `DELETE FROM merchandise_cart WHERE cart_item_id=${res1[0].cart_item_id}`,
                (err, res2) => {
                  if (err) {
                    console.log("error in query2");
                    // res.send("error in query 2");
                  } else {
                    // res.send("deleted successfully!");
                  }
                }
              );
            }
          }
        }
      }
    );
    res.send("deremented/deleted");
  });

  // ! route
  app.post("/incrementCart",checkToken, (req, res) => {
    const userData=req.userData
    console.log(userData)
    connectio.query(
      `SELECT * FROM merchandise_cart c, merch m WHERE c.user_id=(SELECT user_id from users WHERE email='${userData.email}') and c.merch_id=${req.body.body.merch_id} and c.merch_id=m.merch_id`,
      (err, res1) => {
        // console.log(res1);
        if (err) console.log("error in incrementCart");
        else {
          if (res1.length > 0) {
            let json = JSON.parse(JSON.stringify(res1));
            let tempQuantity = res1[0].quantity;
            // console.log(res1[0].merch_limit);
            if (tempQuantity < res1[0].merch_limit) {
              connectio.query(
                `UPDATE merchandise_cart SET quantity=${
                  tempQuantity + 1
                } WHERE cart_item_id=${res1[0].cart_item_id}`,
                (err, res2) => {
                  if (err) {
                    console.log("error in query2");
                    // res.send("error in query 2");
                  } else {
                    // res.send("decremented successfully!");
                  }
                }
              );
            }
          }
        }
      }
    );
    res.send("deremented/deleted");
  });

  // ! route
  app.get("/getCartTotalPrice", checkToken,(req, res) => {
    const userData=req.userData
    // console.log(
    //   `SELECT SUM(c.quantity*m.price) FROM merch m, users u, merchandise_cart c WHERE c.user_id=(SELECT user_id FROM users WHERE email='${user_id}') AND c.merch_id=m.merch_id;`
    // );
    connectio.query(
      `SELECT SUM(c.quantity*m.price) AS sum FROM merch m, users u, merchandise_cart c WHERE c.user_id=(SELECT user_id FROM users WHERE email='${userData.email}') AND c.user_id=u.user_id AND c.merch_id=m.merch_id;`,
      (err, res1) => {
        if (err) {
          console.log("error in getCartTotalPrice");
          res.send("error in getCartTotalPrice");
        } else {
          res.send(res1);
        }
      }
    );
  });
};
