const checkToken=require("../middleware/authenticate")
module.exports = (app, connection) => {
  app.post("/checkout/confirmMerch",checkToken, (req, res) => {
    const userData=req.userData;
    let user_id = "";
    let cartTotal = 0; // ? Have
    // let wallet = 0; // ? Have
    // let cart = {};
    // TODO get user_id
    connection.query(
      `SELECT user_id FROM users WHERE email='${userData.email}'`,
      (err, res1) => {
        if (err) {
          console.log("error in merchCheckout1");
          res.sendStatus(500);
        } else {
          user_id = res1[0].user_id;

          // TODO update wallet
          // getting total cart worth
          connection.query(
            `SELECT SUM(c.quantity*m.price) AS sum FROM merch m, users u, merchandise_cart c WHERE c.user_id=${user_id} AND c.user_id=u.user_id AND c.merch_id=m.merch_id;`,
            (err, res2) => {
              if (err) {
                console.log("failed in merchCheckout2");
                res.sendStatus(500);
              } else {
                cartTotal = res2[0].sum;

                // Update wallet
                connection.query(
                  `UPDATE wallet SET balance=balance-${cartTotal} WHERE user_id=${user_id} AND balance-${cartTotal}>0`,
                  (err, res3) => {
                    if (err) {
                      console.log("failed in merchCheckout3");
                      res.sendStatus(500);
                    } else {
                      console.log("Updated wallet");
                    }
                  }
                );
              }
            }
          );

          // TODO reduce limit in merch
          connection.query(
            `UPDATE merch m, merchandise_cart c SET m.merch_limit = m.merch_limit-c.quantity WHERE c.user_id=${user_id} AND m.merch_id=c.merch_id`,
            (err, res2) => {
              if (err) {
                console.log("failed in merchCheckout4");
                res.sendStatus(500);
              } else {
                console.log("merch limit updated");
              }
            }
          );

          // TODO insert into merchandise_orders
          connection.query(
            `INSERT INTO merchandise_order(merch_id, price, time_purchased, quantity, user_id) SELECT c.merch_id, c.quantity*m.price, now(), c.quantity, c.user_id FROM merchandise_cart c, merch m WHERE c.user_id='${user_id}' AND c.merch_id=m.merch_id`,
            (err, res2) => {
              if (err) {
                console.log("failed in merchCheckout5");
                res.sendStatus(500);
              } else {
                console.log("Added to merchandise_orders");
              }
            }
          );

          // TODO remove from cart
          connection.query(
            `DELETE FROM merchandise_cart WHERE user_id='${user_id}'`,
            (err, res2) => {
              if (err) {
                console.log("failed in merchCheckout6");
                res.sendStatus(500);
              } else {
                console.log("removed from cart");
                res.sendStatus(200);
              }
            }
          );
          // await wait(5000);
          // res.sendStatus(200)
        }
      }
    );
  });

  // ! route
  // !
  // !
  app.post("/checkoutconfirmTicket",checkToken, (req, res) => {
    console.log("called ticket Checkout");
    const userData=req.userData;
    // console.log(req.body);
    // res.sendStatus(201); for error
    let user_id = "";
    // TODO First fetch the user_id
    connection.query(
      `SELECT user_id FROM users WHERE email='${userData.email}'`,
      (err, res1) => {
        if (err) {
          console.log("error in ticketcheckout 1");
          res.sendStatus(201);
        } else {
          user_id = res1[0].user_id;

          // TODO deduct from wallet
          connection.query(
            `UPDATE wallet w, tours t SET w.balance = w.balance - (${req.body.quantity}*t.price) WHERE w.user_id = ${user_id} AND t.tour_id=${req.body.tour_id}`,
            (err, res2) => {
              if (err) {
                console.log("error in ticketcheckout 2");
                res.sendStatus(201);
              } else {
                console.log("deducted from wallet");
              }
            }
          );

          // TODO reduce from Tours
          connection.query(
            `UPDATE tours SET tours_limit = tours_limit-${req.body.quantity} WHERE tour_id = ${req.body.tour_id} AND tours_limit-${req.body.quantity}>=0`,
            (err, res3) => {
              if (err) {
                console.log("error in ticketcheckout 3");
                res.sendStatus(201);
              } else {
                console.log("reduced from tours");
              }
            }
          );

          // TODO Add to ticket_purchase
          connection.query(
            `INSERT INTO ticket_purchase(price, ticket_quantity, time_purchased, tour_id, user_id) SELECT (${req.body.quantity}*t.price), ${req.body.quantity}, now(), ${req.body.tour_id}, ${user_id} FROM tours t WHERE t.tour_id=${req.body.tour_id}`,
            (err, res4) => {
              if (err) {
                console.log("error in ticketcheckout 4");
                res.sendStatus(201);
              } else {
                console.log("added to ticket_purchase");
                res.sendStatus(200);
              }
            }
          );
        }
      }
    );
  });

// app.post()
// res.sendStatus(200)

// // res.json({
// //     message: "Welcome to hhh test application."
// // });
app.post("/checkoutconfirmSingleMerch",checkToken, (req, res) => {
  const userData=req.userData;
  console.log("called single merch Checkout");
  // console.log(req.body);
  // res.sendStatus(201); for error
  let user_id = "";
  // TODO First fetch the user_id
  connection.query(
    `SELECT user_id FROM users WHERE email='${userData.email}'`,
    (err, res1) => {
      if (err) {
        console.log("error in ticketcheckout 1");
        res.sendStatus(201);
      } else {
        user_id = res1[0].user_id;

        // TODO deduct from wallet
        connection.query(
          `UPDATE wallet w, merch m SET w.balance = w.balance - (${req.body.quantity}*m.price) WHERE w.user_id = ${user_id} AND m.merch_id=${req.body.merch_id}`,
          (err, res2) => {
            if (err) {
              console.log("error in ticketcheckout 2");
              res.sendStatus(201);
            } else {
              console.log("deducted from wallet");
            }
          }
        );

        // TODO reduce from Tours
        connection.query(
          `UPDATE merch SET merch_limit = merch_limit-${req.body.quantity} WHERE merch_id = ${req.body.merch_id} AND merch_limit-${req.body.quantity}>=0`,
          (err, res3) => {
            if (err) {
              console.log("error in ticketcheckout 3");
              res.sendStatus(201);
            } else {
              console.log("reduced from tours");
            }
          }
        );

        // TODO Add to ticket_purchase
        connection.query(
          `INSERT INTO merchandise_order(price,quantity, time_purchased, merch_id, user_id) SELECT (${req.body.quantity}*m.price), ${req.body.quantity}, now(), ${req.body.merch_id}, ${user_id} FROM merch m WHERE m.merch_id=${req.body.merch_id}`,
          (err, res4) => {
            if (err) {
              console.log("error in ticketcheckout 4");
              res.sendStatus(201);
            } else {
              console.log("added to ticket_purchase");
              res.sendStatus(200);
            }
          }
        );
      }
    }
  );
});
};