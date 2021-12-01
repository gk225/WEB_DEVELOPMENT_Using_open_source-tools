import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import MerchInCart from "./MerchInCart";
import { Link } from "react-router-dom";
import "./Cartcss.css";
export default class Cart extends Component {
  state = {
    merchs: [],
    quantities: {},
    prices: {},
    totalPrice: 0,
  };
  componentDidMount() {
    if (this.props.signed_in) {
      axios
        .post(
          "/cart",
          {
            message: "view",
            details: {
              email: this.props.context.user,
            },
          },
          {
            headers: {
              authorization: "Bearer " + this.props.context.user,
            },
          }
        )
        .then((res) => {
          // this.setState({ merchs: res.data });
          let quantities = { main: {} };
          let prices = { main: {} };
          let totalPrice = 0;
          res.data.forEach((item) => {
            let temp = { [item.merch_id]: item.quantity };
            let temp1 = { [item.merch_id]: item.price };

            quantities = { main: { ...quantities.main, ...temp } };
            prices = { main: { ...prices.main, ...temp1 } };
            totalPrice = totalPrice + item.price;
          });
          this.setState({
            merchs: res.data,
            quantities: quantities.main,
            prices: prices,
            totalPrice: totalPrice,
          });
        });
    }
  }
  decrementTotalPrice = (id, price) => {
    // console.log(this.state);
    let { prices } = this.state;
    prices[id] = prices[id] - price;
    let tempTotal = this.state.totalPrice - price;
    this.setState({ prices: prices, totalPrice: tempTotal });
    axios.post(
      "/decrementCart",
      {
        body: {
          email: this.props.user,
          merch_id: id,
        },
      },
      {
        headers: {
          authorization: "Bearer " + this.props.user,
        },
      }
    );
  };
  incrementTotalPrice = (id, price) => {
    let { prices } = this.state;
    prices[id] = prices[id] + price;
    let tempTotal = this.state.totalPrice + price;
    this.setState({ prices: prices, totalPrice: tempTotal });
    axios.post(
      "/incrementCart",
      {
        body: {
          email: this.props.user,
          merch_id: id,
        },
      },
      {
        headers: {
          authorization: "Bearer " + this.props.user,
        },
      }
    );
  };
  render() {
    if (this.props.signed_in) {
      let itemsToDisplay = this.state.merchs.map((item) => (
        <MerchInCart
          key={item.merch_id}
          item={item}
          decrement={this.decrementTotalPrice}
          increment={this.incrementTotalPrice}
        />
      ));
      return (
        <div className="cart-container">
          <h1 style={{ marginTop: 10 }} className="h2_upcoming_tours">
            Cart
          </h1>

          {this.state.totalPrice === 0 ? (
            <div>
              <h3 style={{ textAlign: "center", fontSize: 25, marginTop: 10 }}>
                Your cart is empty!
              </h3>
              <div
                className="cart-bottom-buttons-container"
                style={{ justifyContent: "center" }}
              >
                <div
                  className="cart-bottom-buttons-div"
                  style={{ marginLeft: 0 }}
                >
                  <Link className="cart-bottom-buttons" to="/merch">
                    Back to Merch
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="cart-items-above-final-price">
                <div className="merch-in-cart">
                  <div>
                    <div className="cart-quantity-top-container">
                      <span className="cart-quantity-top">Quantity</span>
                    </div>
                    <div className="cart-price-top-container">
                      <span className="cart-price-top">Price</span>
                    </div>
                  </div>
                </div>
                {itemsToDisplay}
              </div>
              <div className="cart-bottom-container">
                <div className="cart-bottom-subtotal-container">
                  <span className="cart-bottom-subtotal">Subtotal</span>
                </div>
                <div className="cart-bottom-final-price-container">
                  <span className="cart-container-final-price">
                    ₹ {this.state.totalPrice}
                  </span>
                </div>
              </div>
              <div className="cart-bottom-buttons-container">
                <div className="cart-bottom-buttons-div">
                  <Link className="cart-bottom-buttons" to="/merch">
                    Back to Merch
                  </Link>
                </div>
                <div className="cart-bottom-buttons-div">
                  <Link className="cart-bottom-buttons" to="/checkout/merch">
                    Checkout
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      );
    } else {
      return <Redirect to="/signin" />;
    }
  }
}
