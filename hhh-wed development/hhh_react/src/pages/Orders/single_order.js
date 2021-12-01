import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
export default class single_order extends React.Component {
  state = {
    order: {},
  };
  componentDidMount() {
    axios
      .get("/merch", {
        params: { merch_id: this.props.order.merch_id },
      })
      .then((res) => {
        // console.log(res);
        this.setState({ order: res.data[0] });
      });
  }

  render() {
    let time1 = new Date(this.props.order.time_purchased);
    let date = time1.toDateString();
    const order_arr = this.state.order;
    // console.log("in single_order order_arr", order_arr);
    return (
      <div className="order">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <img
            src={order_arr.image_url}
            className="merch-image-in-orders"
            alt="merch_image"
          />
          <Link
            to={`/merch/${order_arr.merch_id}`}
            className="order-merch-name"
          >
            {order_arr.merch_name}
          </Link>
          <span className="order-quantity">{this.props.order.quantity} </span>
          <span className="order-price">₹ {this.props.order.price}</span>
        </div>
        <h4> Ordered on: {date}</h4>
      </div>
    );
  }
}
