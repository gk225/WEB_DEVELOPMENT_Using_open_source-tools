import React from "react";
import { useState } from "react";
import { ContextConsumer } from "../../components/Context";
import { Link, Redirect } from "react-router-dom";
function Merch(props) {
  /*

  */
  //The function that determines if available/selling fast should be output
  let [redirectstate, setredirectstate] = useState(false);
  //redirect used to redirect to /signin page
  let [redirect, setredirect] = useState(false);
  //re
  let text1 = "";
  let fast = false;
  let soldOut = false;
  if (props.item.merch_limit === 0) {
    text1 = "Sold Out! :(";
    fast = true;
    soldOut = true;
  } else if (props.item.merch_limit < 10) {
    text1 = "Selling out fast!";
    fast = true;
  } else {
    text1 = "Available";
  }

  function handleAddToCart(context) {
    if (context.signed_in) {
      context.addToCart({
        merch_id: props.item.merch_id,
        quantity: 1,
        merch_limit: props.item.merch_limit,
      });
    } else {
      setredirectstate(true);
    }
  }
  function redirectToSignIn() {
    if (redirectstate) {
      return <Redirect to="/signin" />;
    }
  }
  function redirectToCheckout(merch_id, context) {
    context.chooseMerchToBuy(merch_id);
    setredirect(true);
  }
  return (
    <div className="tour" style={{ fontSize: 25 }}>
      {redirectToSignIn()}
      {redirect ? <Redirect to="/checkout/singlemerch" /> : null}
      <Link to={`/merch/${props.item.merch_id}`}>
        <img
          src={`${props.item.image_url}`}
          alt="merch_image"
          style={{
            width: 180,
            background: "#ddd",
            borderRadius: 4,
          }}
        />
      </Link>
      <h1>
        <Link
          style={{ color: "#222f3e", textDecoration: "none", fontSize: 35 }}
          to={`/merch/${props.item.merch_id}`}
        >
          {props.item.merch_name}
        </Link>
      </h1>
      <div className="tourLower">
        <h4 style={{ color: "#222f3e", paddingTop: 8 }}>
          ₹ {props.item.price}
        </h4>
        {fast ? (
          <h6 style={{ color: "red" }}>{text1}</h6>
        ) : (
          <h6 style={{ color: "#fbfbfb" }}>{text1}</h6>
        )}
        {soldOut ? (
          <button className="buy-btn soldout">Sold Out</button>
        ) : (
          <ContextConsumer>
            {(context) => (
              <>
                <button
                  onClick={() => {
                    context.signed_in
                      ? context.addToCart({
                          user: context.user,
                          merch_id: props.item.merch_id,
                          quantity: 1,
                          merch_limit: props.item.merch_limit,
                        })
                      : // ! This arguments are in accordance to the api call in addToCart in context
                        handleAddToCart(context);
                  }}
                  className="buy-btn"
                  
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    context.signed_in
                      ? redirectToCheckout(props.item.merch_id, context)
                      : props.toggleRedirect();
                  }}
                  className="buy-btn"
                >
                  Buy Now
                </button>
              </>
            )}
          </ContextConsumer>
        )}
      </div>
    </div>
  );
}

export default Merch;
