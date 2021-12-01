const checkToken=require("../middleware/authenticate")
module.exports = (app, connection) => {
  app.post("/checkout/confirmMerch",checkToken,(req, res) => {
    // res.setTimeout(5000);
    // res.setInterval(5000);
    const userData=res.userData;
    let cartTotal = 0; // ? Have
    let wallet = 0; // ? Have
    let cart = {};
    // TODO Deducting money from wallet

    // getting the total cart worth
    connection.query(
      `SELECT SUM(c.quantity*m.price) AS sum FROM merch m, users u, merchandise_cart c WHERE c.user_id=(SELECT user_id FROM users WHERE email='${userData.email}') AND c.user_id=u.user_id AND c.merch_id=m.merch_id;`,
      (err, res1) => {
        if (err) {
          console.log("failed in merchCheckout1");
          res.sendStatus(500);
        } else {
          cartTotal = res1[0].sum;
          // getting the wallet balance
          connection.query(
            `SELECT balance FROM wallet WHERE user_id=(SELECT user_id FROM users WHERE email='${userData.email}')`,
            (err, res1) => {
              if (err) {
                console.log("failed in merchCheckout2");
                res.sendStatus(500);
              } else {
                wallet = res1[0].balance;
                // deducting money from wallet
                let deducted_balance = wallet - cartTotal;
                // console.log("deducted balance", deducted_balance);
                connection.query(
                  `UPDATE wallet SET balance=${deducted_balance} WHERE user_id=(SELECT user_id FROM users WHERE email='${userData.email}')`,
                  (err, res1) => {
                    if (err) {
                      console.log("failed in merchCheckout3");
                      res.sendStatus(500);
                    } else {
                      // TODO Main

                      // getting cart contents
                      connection.query(
                        `SELECT merch_id, quantity FROM merchandise_cart WHERE user_id=(SELECT user_id FROM users WHERE email='${userData.email}')`,
                        (err, res1) => {
                          if (err) {
                            console.log("failed in merchCheckout4");
                            res.sendStatus(500);
                          } else {
                            cart = res1;
                            const curr_date = new Date();

                            for (let [_, obj] of Object.entries(cart)) {
                              console.log(
                                "iterating in the for loop merchCheckout"
                              );
                              let merchValues = {};
                              connection.query(
                                `SELECT * FROM merch WHERE merch_id=${obj.merch_id}`,
                                (err, res1) => {
                                  if (err) {
                                    console.log("failed in merchCheckout5");
                                    res.sendStatus(500);
                                    return;
                                  } else {
                                    // console.log("res1", res1);
                                    merchValues = res1;
                                    let update_quantity =
                                      merchValues[0].merch_limit - obj.quantity;
                                    // console.log(
                                    //   "update_quantity",
                                    //   update_quantity
                                    // );
                                    if (update_quantity < 0) {
                                      update_quantity = 0;
                                    }

                                    // update the merch table
                                    connection.query(
                                      `UPDATE merch SET merch_limit=${update_quantity} WHERE merch_id='${obj.merch_id}'`,
                                      (err, res2) => {
                                        if (err) {
                                          console.log(
                                            "failed in merchCheckout6"
                                          );
                                          res.sendStatus(500);
                                          return;
                                        } else {
                                          console.log("merch quantity updated");

                                          // to get user_id using the email (the userData.email)
                                          connection.query(
                                            `SELECT user_id from users WHERE email='${userData.email}'`,
                                            (err, res4) => {
                                              if (err) {
                                                console.log(
                                                  "failed in merchCheckout7"
                                                );
                                                res.sendStatus(500);
                                                return;
                                              } else {
                                                // add to orders table
                                                console.log(
                                                  "selected user from users",
                                                  res4[0].user_id
                                                );
                                                console.log("adding to orders");
                                                connection.query(
                                                  `INSERT INTO merchandise_order(user_id, quantity, merch_id, price, time_purchased) VALUES (${
                                                    res4[0].user_id
                                                  }, ${obj.quantity}, ${
                                                    obj.merch_id
                                                  }, ${
                                                    merchValues[0].price *
                                                    obj.quantity
                                                  }, ${curr_date})`,
                                                  (err, res3) => {
                                                    if (err) {
                                                      console.log(
                                                        "failed in merchCheckout8",
                                                        res4[0].user_id,
                                                        obj.quantity,
                                                        obj.merch_id,
                                                        merchValues[0].price *
                                                          obj.quantity,
                                                        curr_date
                                                      );
                                                      res.sendStatus(500);
                                                      return;
                                                    } else {
                                                      // remove from cart
                                                      console.log(
                                                        "removing from cart"
                                                      );
                                                      connection.query(
                                                        `DELETE FROM merchandise_cart WHERE user_id=${res4[0].user_id} AND merch_id=${obj.merch_id}`,
                                                        (err, res5) => {
                                                          if (err) {
                                                            console.log(
                                                              "failed in merchCheckout8"
                                                            );
                                                            res.sendStatus(500);
                                                            return;
                                                          } else {
                                                            console.log(
                                                              "successfully bought an item in cart"
                                                            );
                                                          }
                                                        }
                                                      );
                                                    }
                                                  }
                                                );
                                              }
                                            }
                                          );
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            }
                            // res.sendStatus(200);
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  });
  // app.post()
  // res.sendStatus(200)
};


