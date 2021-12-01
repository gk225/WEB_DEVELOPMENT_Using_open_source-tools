import React from "react";
import { useState } from "react";
import { ContextConsumer } from "../../components/Context";
import { Redirect } from "react-router-dom";
function Tour(props) {
  /*
    This function will return single tour items in the tourslist
    The props passed, should have an 'item'
    This data will be queried from Tours Table
    item object will have, 'tour_id', 'tour_name', 'location', 'time', 'price', 'tours_limit'
    */
  //The function that determines if available/selling fast should be output

  const [redirect, setredirect] = useState(false);
  // redirect is used to redirect to checkout/ticket

  let text1 = "";
  let fast = false;
  let soldOut = false;
  if (props.item.tours_limit === 0) {
    text1 = "Sold Out! :(";
    fast = true;
    soldOut = true;
  } else if (props.item.tours_limit < 100) {
    text1 = "Selling out fast!";
    fast = true;
  } else {
    text1 = "Available";
  }
  let time1 = new Date(props.item.time);
  let date = time1.toDateString();
  let time = time1.toTimeString();
  // console.log("time", time);

  // // function handleClick(e) {

  // // console.log(e);

  // // return null;

  // // props.func(e);

  // // }
  function redirectToCheckout(tour_id, context) {
    // if(redirect){
    //   return <Redirect to='/checkout/ticket' />
    // }
    context.choseTicketToBuy(tour_id);
    setredirect(true);
  }
  return (
    <div className="tour" style={{ fontSize: 20 }}>
      {/* {redirectToCheckout()} */}
      {redirect ? <Redirect to="/checkout/ticket" /> : null}
      <img
        src={require("../images/pass.png")}
        alt="pass"
        style={{
          width: 140,
          background: "#ddd",
          border: "1px solid #888",
          borderRadius: 4,
        }}
      />
      <h1 style={{ color: "#000", paddingTop: 10, textAlign: "left" }}>
        {props.item.tour_name.slice(0, 11).toUpperCase()}
      </h1>
      <div className="tourLower">
        <h3 style={{ color: "#000", paddingTop: 20 }}>
          {props.item.location.toUpperCase()}
          <span>
            <h4 style={{ color: "#000", float: "right" }}>
              ₹ {props.item.price}
            </h4>
          </span>
        </h3>
        <h5 style={{ color: "#000" }}>{date.slice(4)}</h5>
        <h5 style={{ color: "#000" }}>{time.slice(0, 5)}</h5>

        {fast ? (
          <h6 style={{ color: "red" }}>{text1}</h6>
        ) : (
          <h6 style={{ color: "#fbfbfb" }}>{text1}</h6>
        )}
        {soldOut ? (
          <button className="buy-btn soldout">SOLD OUT</button>
        ) : (
          <ContextConsumer>
            {(context) => (
              <button
                onClick={() => {
                  context.signed_in
                    ? redirectToCheckout(props.item.tour_id, context)
                    : props.toggleRedirect();
                }}
                className="buy-btn"
              >
                BUY
              </button>
            )}
          </ContextConsumer>
        )}
      </div>
    </div>
  );
}

export default Tour;
