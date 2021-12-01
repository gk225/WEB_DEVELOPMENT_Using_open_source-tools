import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "./MerchCheckoutcss.css";
export default class MerchCheckout extends Component {
  state = {
    wallet: [],
  };
  componentDidMount() {
    if (this.props.context.signed_in) {
      axios
        .get("/getWalletInfo", {
          headers: {
            authorization: "Bearer " + this.props.context.user,
          },
        })
        .then((res) => {
          // console.log(res.data);
          this.setState({ wallet: res.data });
        });
      axios
        .get("/getCartTotalPrice", {
          headers: {
            authorization: "Bearer " + this.props.context.user,
          },
        })
        .then((res) => {
          //   console.log("total subtotal", res);
          this.setState({ cartSubTotal: res.data[0].sum });
        });
    }
  }

  handleClick(e) {
    if (!this.state.redirectToOrders) {
      console.log("called /confirmMetch");
      axios
        .post(
          "/checkout/confirmMerch",
          {
            user_id: this.props.context.user,
          },
          {
            headers: {
              authorization: "Bearer " + this.props.context.user,
            },
          }
        )
        .then((res) => {
          if (res) {
            if (res.status === 200) {
              this.setState({ redirectToOrders: true });
            } else {
              this.setState({ showError1: true });
            }
          } else {
            this.setState({ showError1: true });
          }
        });
    } else {
      this.setState({ showError1: true });
    }
  }
  render() {
    // {this.props.context.signed_in}
    // console.log(this.state);
    let date1 = new Date(this.state.wallet.expiry);
    let date_to_display = date1.toDateString();
    let balance_after_payment =
      this.state.wallet.balance - this.state.cartSubTotal;
    if (this.props.context.signed_in) {
      return (
        <>
          <h1 className="checkout-page-h1">Checkout</h1>
          <div className="checkout-page-container">
            <div className="checkout-page-left-wallet-container">
              <h3 className="checkout-page-h3">Your Wallet Details</h3>
              <div>
                <div className="checkout-page-left-wallet-left">
                  <span>User ID: </span>
                </div>
                <div className="checkout-page-left-wallet-right">
                  <span>{this.state.wallet.user_id}</span>
                </div>
              </div>
              <div>
                <div className="checkout-page-left-wallet-left">
                  <span>Email: </span>
                </div>
                <div className="checkout-page-left-wallet-right">
                  <span>{this.state.wallet.email}</span>
                </div>
              </div>
              <div>
                <div className="checkout-page-left-wallet-left">
                  <span>Wallet ID: </span>
                </div>
                <div className="checkout-page-left-wallet-right">
                  <span>{this.state.wallet.wallet_id}</span>
                </div>
              </div>
              <div>
                <div className="checkout-page-left-wallet-left">
                  <span>Expiry: </span>
                </div>
                <div className="checkout-page-left-wallet-right">
                  <span>{date_to_display.slice(4, 15)}</span>
                </div>
              </div>
            </div>
            <div className="checkout-page-right-container">
              <div className="checkout-page-above-final-price">
                <div>
                  <div className="checkout-page-above-fp-left">
                    <span>Available balance</span>
                  </div>
                  <div className="checkout-page-above-fp-right">
                    <span>₹ {this.state.wallet.balance}</span>
                  </div>
                </div>
                <div>
                  <div className="checkout-page-above-fp-left">
                    <span>Subtotal</span>
                  </div>
                  <div className="checkout-page-above-fp-right">
                    <span>₹ {this.state.cartSubTotal}</span>
                  </div>
                </div>
              </div>
              <div className="checkout-page-below-final-price">
                <div>
                  <div className="checkout-page-above-fp-left">
                    <span>Balance after payment</span>
                  </div>
                  <div className="checkout-page-above-fp-right">
                    <span>₹ {balance_after_payment.toString()}</span>
                  </div>
                </div>
                {balance_after_payment > 0 ? (
                  !this.state.redirectToOrders ? (
                    <div style={{ float: "right" }}>
                      <button
                        onClick={(e) => this.handleClick(e)}
                        className="checkout-page-confirm-button"
                      >
                        Confirm
                      </button>
                    </div>
                  ) : null
                ) : (
                  <div>
                    <Link
                      to="/wallet/addToWallet"
                      className="checkout-page-confirm-button"
                    >
                      Add money to wallet
                    </Link>
                  </div>
                )}
              </div>
              {this.state.showError1 ? (
                <div className="checkout-page-alert-message">
                  <h4>There was some error!</h4>
                </div>
              ) : null}
              {this.state.redirectToOrders ? (
                <div className="checkout-page-alert-message">
                  <h4>Order was successfully placed</h4>
                  <Link className="cart-bottom-buttons" to="/orders">
                    Back to orders
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </>
      );
    } else {
      return <Redirect to="/signin" />;
    }
  }
}
