const config = require("../config/keys");
const stripe = require("stripe")(config.stripesecret);
const checkToken = require("../middleware/authenticate");
module.exports = (app, connection) => {
  // ! route

  app.get("/getWalletInfo", checkToken, (req, res) => {
    const userData = req.userData;
    connection.query(
      `SELECT * FROM wallet w, users u WHERE w.user_id = u.user_id AND u.email='${userData.email}'`,
      (err, res1, fields) => {
        if (err) {
          console.log("error in query 1 of getWalletInfo");
          res.send({
            message: "error in query 1 of getWalletInfo",
          });
        } else {
          // console.log(res1);
          let {
            balance,
            email,
            expiry,
            user_id,
            wallet_id,
            first_name,
          } = res1[0];
          let sendingObject = {
            balance,
            email,
            expiry,
            user_id,
            wallet_id,
            first_name,
            email: res1[0].email,
          };
          res.send(sendingObject);
          // console.log(sendingObject);
        }
      }
    );
  });

  // ! route
  app.post("/rechargeWallet", checkToken, (req, res) => {
    const userData = req.userData;
    // TODO get user_id
    connection.query(
      `SELECT user_id FROM users WHERE email='${userData.email}'`,
      (err, res1) => {
        if (err) {
          console.log("error in rechargeWallet 1");
          res.sendStatus(201);
        } else {
          const user_id = res1[0].user_id;
          // console.log("user_id", res1[0].user_id);
          // TODO increase the wallet by amount
          // console.log(
          //   `UPDATE wallet SET balance=balance+${req.body.amount}, expiry=DATE_ADD(expiry, INTERVAL 2 MONTH) WHERE user_id=${user_id}`
          // );
          connection.query(
            `UPDATE wallet SET balance=balance+${req.body.amount}, expiry=DATE_ADD(expiry, INTERVAL 2 MONTH) WHERE user_id=${user_id}`,
            (err, res2) => {
              if (err) {
                console.log("error in rechargeWallet 2");
                res.sendStatus(201);
              } else {
                console.log("successfully recharged the wallet");
                res.sendStatus(200);
              }
            }
          );
        }
      }
    );
  });
  const postStripeCharge = (res, email, amount) => (stripeErr, stripeRes) => {
    if (stripeErr) {
      console.log("error in rechargeWallet with stripe");
      res.sendStatus(201);
    } else {
      connection.query(
        `SELECT user_id FROM users WHERE email='${email}'`,
        (err, res1) => {
          if (err) {
            console.log("error in rechargeWallet 1");
            res.sendStatus(201);
          } else {
            const user_id = res1[0].user_id;
            // console.log("user_id", res1[0].user_id);
            // TODO increase the wallet by amount
            // console.log(
            //   `UPDATE wallet SET balance=balance+${req.body.amount}, expiry=DATE_ADD(expiry, INTERVAL 2 MONTH) WHERE user_id=${user_id}`
            // );
            connection.query(
              `UPDATE wallet SET balance=balance+${amount}, expiry=DATE_ADD(expiry, INTERVAL 2 MONTH) WHERE user_id=${user_id}`,
              (err, res2) => {
                if (err) {
                  console.log("error in rechargeWallet 2");
                  res.sendStatus(201);
                } else {
                  console.log("successfully recharged the wallet");
                  res.sendStatus(200);
                }
              }
            );
          }
        }
      );
    }
  };
  app.post("/rechargeStripe", async (req, res) => {
    let error;
    let status;
    const token = req.body.token;
    const amount = req.body.amount;

    const customer = await stripe.customers.create({
      source: "tok_visa",
      email: token.email,
    });

    const charge = await stripe.charges.create(
      {
        amount: amount * 100,
        currency: "INR",
        customer: customer.id,
        description: `Added to ${amount} walllet`,
      },
      postStripeCharge(res, token.email, amount)
    );
  });
};
