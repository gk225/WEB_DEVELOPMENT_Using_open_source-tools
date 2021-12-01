import React from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import "./SingleMerchcss.css";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { ContextConsumer } from "../../components/Context";
import { Helmet } from "react-helmet";
export default function SingleMerch(props) {
  const { product_id } = useParams();
  let [redirectstate, setredirectstate] = useState(false);
  let [state, setstate] = useState({ gotData: false });
  let [formstate, setformstate] = useState({ quantity: 1 });
  let [redirectcheckout, setredirectcheckout] = useState(false);
  // // console.log("props of SingleMerch", props);
  async function getData() {
    if (!state.gotData) {
      await axios
        .get("http://localhost:5000/merch", {
          params: { merch_id: product_id },
        })
        .then((res) => {
          if (res.data.length !== 0)
            setstate({ merch: res.data[0], gotData: true });
        });
    }
  }
  function decrementQuantity(e) {
    if (formstate.quantity > 0) {
      setformstate({ quantity: formstate.quantity - 1 });
    }
  }
  function incrementQuantity(e) {
    if (formstate.quantity < state.merch.merch_limit) {
      setformstate({ quantity: formstate.quantity + 1 });
    } else {
      setformstate({ quantity: formstate.quantity });
    }
  }

  if (!state.gotData) {
    getData();
  } else {
    let displayAvailable = "";
    if (state.merch.merch_limit === 0) {
      displayAvailable = (
        <span
          className="product-page-available-status"
          style={{ color: "red", fontSize: 35 }}
        >
          Sold out
        </span>
      );
    } else if (state.merch.merch_limit < 10) {
      displayAvailable = (
        <span
          className="product-page-available-status"
          style={{ color: "red" }}
        >
          Selling out fast!
        </span>
      );
    } else {
      displayAvailable = (
        <span className="product-page-available-status">Available</span>
      );
    }
    function handleAddToCart(context) {
      if (context.signed_in) {
        if (formstate.quantity > 0) {
          context.addToCart({
            merch_id: state.merch.merch_id,
            quantity: formstate.quantity,
            merch_limit: state.merch.merch_limit,
          });
        }
      } else {
        setredirectstate(true);
      }
    }
    function handleBuyNow(context) {
      if (context.signed_in) {
        if (formstate.quantity > 0) {
          context.chooseMerchToBuy(state.merch.merch_id);
          setredirectcheckout(true);
        }
      } else {
        setredirectstate(true);
      }
    }
    function redirect() {
      if (redirectstate) {
        return <Redirect to="/signin" />;
      } else if (redirectcheckout) {
        return <Redirect to="/checkout/singlemerch" />;
      }
    }
    return (
      <div className="product-page-container">
        {redirect()}
        <Helmet>
          <title>{state.merch.merch_name} | HHH</title>
          <link rel="icon" href="../../../public/new_logo.png" />
        </Helmet>
        <div className="product-page-image-container">
          <div className="product-page-thumbnail-container">
            <div
              onClick={() => {
                console.log("thumbnail changed!");
              }}
              className="product-page-thumbnail-button"
            >
              <img
                className="product-page-thumbnail"
                src={state.merch.image_url}
                alt="thumb 1"
              />
            </div>
          </div>
          <div>
            <img
              className="product-page-image"
              src={state.merch.image_url}
              alt="main_img"
            />
          </div>
        </div>
        <div className="product-page-merch-info">
          <h1 className="product-page-merch-info-h1">
            {state.merch.merch_name}
          </h1>
          <span className="product-page-price">₹ {state.merch.price}</span>
          <div className="product-page-description-container">
            <span className="product-page-description">
              {state.merch.description}
            </span>
          </div>
          {displayAvailable}

          {state.merch.merch_limit !== 0 ? (
            <>
              <span className="product-page-form__Label">Quantity:</span>
              <div className="product-page-form__quantity">
                <div className="quantity quantity--large">
                  <span
                    className="quantity__Button Link Link--secondary"
                    onClick={() => decrementQuantity()}
                  >
                    -
                  </span>
                  <input
                    type="text"
                    className="quantity__CurrentQuantity"
                    name="quantity"
                    value={formstate.quantity}
                    readOnly
                  />
                  <span
                    className="quantity__Button Link Link--secondary"
                    onClick={() => incrementQuantity()}
                  >
                    +
                  </span>
                </div>
              </div>

              <ContextConsumer>
                {(context) => {
                  return (
                    <>
                      <div className="product-page-add-to-cart-div">
                        <button
                          className="product-page-add-to-cart"
                          onClick={() => handleAddToCart(context)}
                        >
                          ADD TO CART
                        </button>
                      </div>
                      <div className="product-page-add-to-cart-div">
                        <button
                          className="product-page-buy-now"
                          onClick={() => {
                            handleBuyNow(context);
                          }}
                        >
                          BUY NOW
                        </button>
                      </div>
                    </>
                  );
                }}
              </ContextConsumer>
            </>
          ) : null}
        </div>
      </div>
    );
  }
  return <span className="product-page-form__Label">There's an issue</span>;
}
