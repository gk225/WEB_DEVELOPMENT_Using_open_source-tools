import React from "react";
import Tour from "./Tour";
import axios from "axios";
import { Redirect } from "react-router-dom";
class Tours extends React.Component {
  constructor() {
    super();
    this.state = {
      tours: [],
    };
    this.toggleRedirect = this.toggleRedirect.bind(this);
    this.buyTicket = this.buyTicket.bind(this);
  }
  renderRedirect() {
    if (this.state.redirectToSignin) {
      return <Redirect to="/signin" />;
    } else if (this.state.redirectToCart) {
      return (
        <Redirect
          to={{
            pathname: "/checkout/ticket",
            state: { tour_id: this.state.tour_id_to_be_purchased },
          }}
        />
      );
    }
  }

  buyTicket(tour_id) {
    this.setState({ redirectToCart: true, tour_id_to_be_purchased: tour_id });
  }
  toggleRedirect() {
    this.setState({ redirectToSignin: true });
  }
  componentDidMount() {
    axios.get("http://localhost:5000/tours").then((res) => {
      const tours = res.data;
      // console.log(res.data);
      this.setState({ tours: tours });
    });
  }
  render() {
    let items = this.state.tours.map((item) => {
      return (
        <Tour
          buyTicket={this.buyTicket}
          toggleRedirect={this.toggleRedirect}
          key={item.tour_id}
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
        <h2 className="h2_upcoming_tours">Upcoming tours of HHH</h2>
        <div className="tours_list">{items}</div>
      </div>
    );
  }
}
export default Tours;
