//import React, { Component } from "react";
//import { Redirect } from "react-router-dom";
//import axios from "axios";
//import { Link } from "react-router-dom";
//
//export default class MerchCheckout extends Component {
//  state = {
//    wallet: [],
//  };
//  componentDidMount() {
//    if (this.props.context.signed_in) {
//      console.log(this.props.context.user);
//      axios
//        .get("/getWalletInfo", {
//          headers: {
//            authorization: "Bearer " + this.props.context.user,
//          },
//        })
//        .then((res) => {
//          // console.log(res.data);
//          this.setState({ wallet: res.data });
//        });
//      axios
//        .get("/getCartTotalPrice", {
//          headers: {
//            authorization: "Bearer " + this.props.context.user,
//          },
//        })
//        .then((res) => {
//          //   console.log("total subtotal", res);
//          this.setState({ cartSubTotal: res.data[0].sum });
//        });
//    }
//  }
//  handleClick(e) {
//    axios
//      .post(
//        "/checkout/confirmMerch",
//        {
//          user_id: this.props.context.user,
//        },
//        {
//          headers: {
//            authorization: "Bearer " + this.props.context.user,
//          },
//        }
//      )
//      .then((res) => {
//        if (res) {
//          if (res.status == 200) {
//            this.setState({ redirectToOrders: true });
//          } else {
//            this.setState({ showError: true });
//          }
//        }
//      });
//    // this.setState({ redirectToOrders: true });
//  }
//  render() {
//    // {this.props.context.signed_in}
//    // console.log(this.state);
//    let date1 = new Date(this.state.wallet.expiry);
//    let date_to_display = date1.toDateString();
//    let balance_after_payment =
//      this.state.wallet.balance - this.state.cartSubTotal;
//    if (this.props.context.signed_in) {
//      return (
//        <>
//          <div className="checkout-page-container">
//            <div className="checkout-page-left-wallet-container">
//              <h1>Your Wallet Details</h1>
//              <div>
//                <span>User ID: </span>
//                <span>{this.state.wallet.user_id}</span>
//              </div>
//              <div>
//                <span>Wallet ID: </span>
//                <span>{this.state.wallet.wallet_id}</span>
//              </div>
//              <div>
//                <span>Expiry: </span>
//                <span>{date_to_display.slice(4, 15)}</span>
//              </div>
//            </div>
//            <div className="checkout-page-right-container">
//              <div className="checkout-page-above-final-price">
//                <div>
//                  <span>Available balance</span>
//                  <span>{this.state.wallet.balance}</span>
//                </div>
//                <div>
//                  <span>Subtotal</span>
//                  <span>{this.state.cartSubTotal}</span>
//                </div>
//              </div>
//              <div className="checkout-page-below-final-price">
//                <div>
//                  <div>
//                    <span>Balance after payment</span>
//                  </div>
//                  <div>
//                    <span>{balance_after_payment.toString()}</span>
//                  </div>
//                </div>
//                {balance_after_payment > 0 ? (
//                  <div>
//                    <button onClick={(e) => this.handleClick(e)}>
//                      Confirm
//                    </button>
//                  </div>
//                ) : (
//                  <div>
//                    <Link to="/wallet/addToWallet">Add money to wallet</Link>
//                  </div>
//                )}
//              </div>
//              {this.state.showError ? (
//                <div>
//                  <h4>There was some error</h4>
//                </div>
//              ) : null}
//            </div>
//            {this.state.redirectToOrders ? (
//              <div>
//                <h4>Order was successful</h4>
//                <Link to="/orders">Back to orders</Link>
//              </div>
//            ) : null}
//          </div>
//        </>
//      );
//    } else {
//      return <Redirect to="/signin" />;
//    }
//    // return <Redirect to="/signin" />;
//  }
//}
