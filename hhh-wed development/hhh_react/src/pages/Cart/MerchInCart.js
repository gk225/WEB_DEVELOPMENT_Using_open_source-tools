import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
export default function MerchInCart(props) {
  let [formstate, setformstate] = useState({ quantity: props.item.quantity });
  function decrementQuantity(e) {
    if (formstate.quantity > 0) {
      setformstate(
        { quantity: formstate.quantity - 1 },
        props.decrement(props.item.merch_id, props.item.individual_price)
      );
    }
  }
  function incrementQuantity(e) {
    if (formstate.quantity < props.item.merch_limit) {
      setformstate(
        { quantity: formstate.quantity + 1 },
        props.increment(props.item.merch_id, props.item.individual_price)
      );
    } else {
      setformstate({ quantity: formstate.quantity });
    }
  }
  //   function updateParent(b) {
  //     let totalPrice = props.item.individual_price * formstate.quantity;
  //     props.updateQuantity(props.item.merch_id, b);
  //   }
  if (formstate.quantity > 0) {
    return (
      <div className="merch_in_cart">
        <ul className="cart-container-left-ul">
          <img
            src={props.item.image_url}
            className="merch-image-in-cart"
            alt="merch_image"
          />
          <Link
            to={`/merch/${props.item.merch_id}`}
            className="cart-merch-name"
          >
            {props.item.merch_name}
          </Link>
          <div className="cart-form__quantity">
            <div className="cart-quantity cart-quantity--large">
              <span
                className="cart-quantity__Button"
                onClick={() => {
                  decrementQuantity();
                }}
              >
                –
              </span>
              <input
                type="text"
                className="cart-quantity__CurrentQuantity"
                name="cart-quantity"
                value={formstate.quantity}
                readOnly
              />
              <span
                className="cart-quantity__Button"
                onClick={() => {
                  incrementQuantity();
                }}
              >
                +
              </span>
            </div>
          </div>
          <span className="cart-merch-current-price">
            ₹ {props.item.individual_price}
          </span>
          <span className="cart-merch-quantity">x {formstate.quantity}</span>
        </ul>
        <div className="cart-container-right-price">
          <span>₹ {props.item.individual_price * formstate.quantity}</span>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
