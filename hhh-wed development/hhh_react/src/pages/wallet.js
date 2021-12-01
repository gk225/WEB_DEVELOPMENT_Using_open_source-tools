import React, { Component } from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import "../css/wallet.css";
export default class Wallet extends Component {
  state = {
    wallet: [],
  };
  componentDidMount() {
    if (this.props.context.signed_in) {
      axios
        .get("http://localhost:5000/getWalletInfo", {
          headers: {
            authorization: "Bearer " + this.props.context.user,
          },
        })
        .then((res) => {
          this.setState({ wallet: res.data });
        });
    }
  }
  render() {
    // {this.props.context.signed_in}
    // console.log(this.state);
    let date1 = new Date(this.state.wallet.expiry);
    let date_to_display = date1.toDateString();
    // console.log(this.state.wallet.email);
    if (this.props.context.signed_in) {
      return (
        <>
          <h1 className="checkout-page-h1">WALLET</h1>
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
                    <span>Available balance :</span>
                  </div>
                  <div className="checkout-page-above-fp-right">
                    <span>₹ {this.state.wallet.balance}</span>
                  </div>
                </div>
              </div>
              <div className="moneytowallet">
                <div>
                  <Link
                    to={{
                      pathname: "/wallet/addToWallet",
                      userProps: {
                        email: this.state.wallet.email,
                        first_name: this.state.wallet.first_name,
                        balance: this.state.wallet.balance,
                      },
                    }}
                    className="checkout-page-confirm-button"
                  >
                    ADD MONEY TO WALLET
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return <Redirect to="/signin" />;
    }
    // return <Redirect to="/signin" />;
  }
}
