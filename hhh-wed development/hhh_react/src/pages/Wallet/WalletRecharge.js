import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import "./walletrecharge.css";
import StripeCheckout from "react-stripe-checkout";
export default class WalletRecharge extends Component {
  state = {
    cardnum: "",
    expiry: "",
    pin: "",
    amount: "",
    redirect: false,
  };

  handleSubmit = (e) => {
    // The user_email in the post body is actually user_id
    axios
      .post(
        "/rechargeWallet",
        {
          user_email: this.props.context.user,
          amount: this.state.amount,
        },
        {
          headers: {
            authorization: "Bearer " + this.props.context.user,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          this.setState({ redirect: true });
        }
      });
  };
  renderRedirect() {
    if (this.state.redirect) {
      return <Redirect to="/wallet" />;
    }
  }
  handleToken1000 = async (token) => {
    const response = await axios.post("/rechargeStripe", {
      token: token,
      amount: 1000,
    });
    console.log(response);
    if (response.status === 200) {
      console.log("Success");
      this.setState({ redirect: true });
      alert(`Added ₹1000 to your account`);
    } else {
      console.log(response.status);
    }
  };
  handleToken5000 = async (token) => {
    const response = await axios.post("/rechargeStripe", {
      token: token,
      amount: 5000,
    });
    console.log(response);
    if (response.status === 200) {
      console.log("Success");
      this.setState({ redirect: true });
      alert("Added ₹5000 to your account");
    } else {
      console.log(response.status);
    }
  };
  handleToken10000 = async (token) => {
    const response = await axios.post("/rechargeStripe", {
      token: token,
      amount: 10000,
    });
    console.log(response);
    if (response.status === 200) {
      console.log("Success");
      this.setState({ redirect: true });
      alert("Added ₹10000 to your account");
    } else {
      console.log(response.status);
    }
  };
  render() {
    return (
      <>
        {this.renderRedirect()}
        {this.props.context.signed_in ? (
          <div className="walletrecharge">
            <form className="stripe">
              <h2>Wallet Recharge</h2>
              <text style={{ marginBottom: 15, fontSize: 20 }}>
                Choose from the following options
              </text>
              <StripeCheckout
                stripeKey="pk_test_51GqJIvEkPqBpQLilcyu9WGiBe3RZ3LVo1wlmCQ7O9yv0rZDz9i0hcszPDf56UJvBAqVIAXlVOnvataXe4g1rY6bU00xc2wxNyW"
                label="₹1,000.00"
                name={this.props.location.userProps.first_name}
                description={`Current Balance : ₹${this.props.location.userProps.balance}`}
                amount={1000 * 100}
                token={this.handleToken1000}
                currency={"INR"}
                email={this.props.location.userProps.email}
              >
                <input
                  type="radio"
                  id="thousand"
                  name="stripeChooseOne"
                  className="stripeInputRadio"
                />
                <label htmlFor="thousand" className="stripeInputRadioLabel">
                  <span style={{ fontSize: "x-large" }}>₹ </span>1,000
                </label>
              </StripeCheckout>
              <StripeCheckout
                stripeKey="pk_test_51GqJIvEkPqBpQLilcyu9WGiBe3RZ3LVo1wlmCQ7O9yv0rZDz9i0hcszPDf56UJvBAqVIAXlVOnvataXe4g1rY6bU00xc2wxNyW"
                name={this.props.location.userProps.first_name}
                label="₹5,000.00"
                description={`Current Balance : ₹${this.props.location.userProps.balance}`}
                amount={5000 * 100}
                token={this.handleToken5000}
                currency={"INR"}
                email={this.props.location.userProps.email}
              >
                <input
                  type="radio"
                  id="fiveThousand"
                  name="stripeChooseOne"
                  className="stripeInputRadio"
                />
                <label htmlFor="fiveThousand" className="stripeInputRadioLabel">
                  <span style={{ fontSize: "x-large" }}>₹ </span> 5,000
                </label>
              </StripeCheckout>
              <StripeCheckout
                stripeKey="pk_test_51GqJIvEkPqBpQLilcyu9WGiBe3RZ3LVo1wlmCQ7O9yv0rZDz9i0hcszPDf56UJvBAqVIAXlVOnvataXe4g1rY6bU00xc2wxNyW"
                name={this.props.location.userProps.first_name}
                label="₹10,000.00"
                description={`Current Balance : ₹${this.props.location.userProps.balance}`}
                amount={10000 * 100}
                token={this.handleToken10000}
                currency={"INR"}
                email={this.props.location.userProps.email}
              >
                <input
                  type="radio"
                  id="tenThousand"
                  name="stripeChooseOne"
                  className="stripeInputRadio"
                />
                <label htmlFor="tenThousand" className="stripeInputRadioLabel">
                  <span style={{ fontSize: "x-large" }}>₹ </span> 10,000
                </label>
              </StripeCheckout>
            </form>
          </div>
        ) : (
          <Redirect to="/signin" />
        )}
      </>
    );
  }
}
