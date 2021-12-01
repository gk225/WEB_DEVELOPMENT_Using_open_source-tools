import React, { Component } from "react";
import axios from "axios";
import Merch from "./Merch";
import { Redirect } from "react-router-dom";
export default class Merchs extends Component {
  constructor() {
    super();
    this.state = {
      merchs: [],
    };
    this.toggleRedirect = this.toggleRedirect.bind(this);
  }
  renderRedirect() {
    if (this.state.redirectToSignin) {
      return <Redirect to="/signin" />;
    } else if (this.state.redirectToCheckout) {
      return (
        <Redirect
          to={{
            pathname: "/checkout/singlemerch",
            state: { merch_id: this.state.merch_id_to_be_purchased },
          }}
        />
      );
    }
  }
  buyMerch(merch_id) {
    this.setState({
      redirectToCheckout: true,
      merch_id_to_be_purchased: merch_id,
    });
  }
  toggleRedirect() {
    this.setState({ redirectToSignin: true });
  }
  componentDidMount() {
    axios.get("http://localhost:5000/merch").then((res) => {
      let merchs = res.data;
      // // console.log("res.data", res.data);
      this.setState({ merchs: merchs });
      // // console.log("merchs", merchs);
    });
  }
  render() {
    // // console.log("merchs in render", this.state.merchs);
    let items = this.state.merchs.map((item) => {
      return (
        <Merch
          buyMerch={this.buyMerch}
          toggleRedirect={this.toggleRedirect}
          key={item.merch_id}
          item={item}
        />
      );
    });
    if (items.length === 0) {
      items = <h2>There seems to be an error in the backend!</h2>;
    }
    return (
      <div>
        {this.renderRedirect()}
        <h2 className="h2_upcoming_tours">Merchandise for Grab</h2>
        <div className="tours_list">{items}</div>
      </div>
    );
  }
}
