import React, { Component } from "react";
import { Link } from "react-router-dom";
import Particles from "react-particles-js";
import axios from "axios";
import { ContextConsumer } from "../components/Context";
import { Redirect } from "react-router-dom";
export default class Signup extends Component {
  particlesOptions = {
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "000000",
      },

      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 1,
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#000000",
        opacity: 0.4,
        width: 0.5,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
  };
  constructor() {
    super();
    this.state = {
      redirect: false,
      name: "",
      lastname: "",
      email: "",
      password: "",
      repassword: "",
      phone: "",
      showServerErr: false,
    };
    this.baseState = this.state;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
    if (this.state.showServerErr) {
      this.setState({
        showServerErr: false,
      });
    }
  };
  handleSubmit = (e, props) => {
    let user = {
      first_name: this.state.name,
      last_name: this.state.lastname,
      email: this.state.email,
      password: this.state.password,
      phone: this.state.phone,
    };
    e.preventDefault();
    if (this.validate()) {
      axios
        .post("/users", { user })
        .then((res) => {
          console.log(res.status);
          if (res.status === 200) {
            // props.SignIn();
            this.setState({ redirect: true });
          }
        })
        .catch((err) => {
          const resp = err.response;
          if (resp.status === 418) {
            window.alert("User already present in database");
            this.setState({
              redirect: true,
            });
            return;
          } else if (resp.status === 500) {
            this.setState({
              showServerErr: true,
            });
          }
        });
    } else {
      console.log("register fail");
      this.setState({
        password: "",
        repassword: "",
      });
    }
  };
  validate() {
    let email = this.state.email;
    let password = this.state.password;
    let repassword = this.state.repassword;
    let name = this.state.name;
    let phone = this.state.phone;
    if (name === "") {
      window.alert("Please enter your name");
      return false;
    } else if (email === "") {
      window.alert("Please enter a valid e-mail address.");
      return false;
    } else if (password === "") {
      window.alert("Please enter a password");
      return false;
    } else if (password.length < 8) {
      window.alert("Password is small (Minimum characters : 8)");
      return false;
    } else if (password !== repassword) {
      window.alert("Passwords do not match");
      return false;
    } else if (phone.length !== 10) {
      window.alert("Phone number must have 10 numbers");
      return false;
    }
    return true;
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/signin" />;
    }
  };
  render() {
    return (
      <div className="signInUPContainer">
        {this.renderRedirect()}
        <Particles className="particles" params={this.particlesOptions} />
        <div className="signin-box-container">
          <h1>Sign up</h1>
          <ContextConsumer>
            {(item) => (
              <div>
                <form
                  className="forms"
                  onSubmit={(e) => this.handleSubmit(e, item)}
                >
                  <div className="form">
                    <input
                      type="text"
                      value={this.state.name}
                      onChange={this.handleChange}
                      name="name"
                      placeholder=" "
                      required
                    />
                    <label htmlFor="name" className="tbox">
                      <span className="spanInLabel">First name</span>
                    </label>
                  </div>
                  <div className="form">
                    <input
                      type="text"
                      value={this.state.lastname}
                      onChange={this.handleChange}
                      name="lastname"
                      placeholder=" "
                      required
                    />
                    <label htmlFor="lastname" className="tbox">
                      <span className="spanInLabel">Last name</span>
                    </label>
                  </div>

                  <div className="form">
                    <input
                      type="number"
                      className="number-input"
                      value={this.state["phone"]}
                      onChange={this.handleChange}
                      name="phone"
                      placeholder=" "
                      required
                    />
                    <label htmlFor="phone" className="tbox">
                      <span className="spanInLabel">Phone Number</span>
                    </label>
                  </div>

                  <div className="form">
                    <input
                      type="email"
                      value={this.state["email"]}
                      onChange={this.handleChange}
                      name="email"
                      placeholder=" "
                      required
                    />
                    <label htmlFor="email" className="tbox">
                      <span className="spanInLabel">Email</span>
                    </label>
                  </div>

                  <div className="form">
                    <input
                      type="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                      name="password"
                      placeholder=" "
                      required
                    />
                    <label htmlFor="password" className="tbox">
                      <span className="spanInLabel">Password</span>
                    </label>
                  </div>
                  <div className="form">
                    <input
                      type="password"
                      value={this.state.repassword}
                      onChange={this.handleChange}
                      name="repassword"
                      placeholder=" "
                      required
                    />
                    <label htmlFor="repassword" className="tbox">
                      <span className="spanInLabel">Re-enter Password</span>
                    </label>
                  </div>
                  {this.state.showServerErr ? (
                    <span
                      style={{
                        color: "#bd3131",
                        fontStyle: "italic",
                        cursor: "default",
                      }}
                    >
                      Server Error!
                    </span>
                  ) : null}
                  <input className="loginbtn" type="submit" value="Sign Up" />
                </form>
              </div>
            )}
          </ContextConsumer>
          <Link to="/signin" className="new_member_text">
            Already a member?
          </Link>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    this.setState(this.baseState);
  }
}
