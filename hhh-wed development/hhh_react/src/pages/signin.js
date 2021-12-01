import React from "react";
import Particles from "react-particles-js";
import { ContextConsumer } from "../components/Context";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
class SignIn extends React.Component {
  particlesOptions = {
    particles: {
      number: {
        value: 30,
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
        distance: 200,
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
      email: "",
      password: "",
      showError: false,
      showServerErr: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount(){
    const cookieJwt = Cookies.get('token');
    if (cookieJwt) {
      console.log("HELL YEAH!")
      Cookies.remove('token');
      this.props.context.SignIn(cookieJwt);
      this.setState({ redirect: true });
    }
  }
  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      showError: false,
      showServerErr: false,
    });
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
  };
  handleSubmit = (e, context) => {
    e.preventDefault();
    let user = {
      email: this.state.email,
      password: this.state.password,
    };
    if (this.validate()) {
      // console.log("logged_in");
      // context.SignIn(this.state.email);
      axios
        .post("http://localhost:5000/signin", { user })
        .then((res) => {
          if (res.data.done) {
            // console.log("w");
            context.SignIn(res.data.token);
            this.setState({ redirect: true });
          } else {
            this.setState({
              password: "",
              showError: true,
            });
          }
        })
        .catch(() => {
          this.setState({
            showServerErr: true,
          });
        });
    } else {
      console.log("sign_in_failed");
      this.setState({
        password: "",
        showError: true,
      });
    }
  };
  validate() {
    let email = this.state["email"];
    let password = this.state["password"];
    if (email === "") {
      window.alert("Please enter a valid e-mail address.");
      return false;
    }

    if (password === "") {
      window.alert("Please enter your password");
      return false;
    }

    if (password.length < 8) {
      window.alert("Password is small(Minimum characters:8)");
      return false;
    }
    return true;
  }
  render() {
    const signed_in = this.props.context.signed_in;
    return (
      <div>
        {this.renderRedirect()}
        {signed_in ? (
          <Redirect to="/" />
        ) : (
          // // If user is already signed in, he should be redirected to /
          // // This closes issue #3
          <div className="signInUPContainer">
            <Particles className="particles" params={this.particlesOptions} />
            <div className="signin-box-container">
              <h1>Log In</h1>
              <ContextConsumer>
                {(context) => (
                  <>
                    <form
                      className="forms"
                      onSubmit={(e) => this.handleSubmit(e, context)}
                    >
                      <div className="form">
                        <input
                          type="email"
                          value={this.state.email}
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
                          value={this.state["password"]}
                          onChange={this.handleChange}
                          name="password"
                          placeholder=" "
                          required
                        />
                        <label htmlFor="password" className="tbox">
                          <span className="spanInLabel">Password</span>
                        </label>
                      </div>
                      {/* <div>
                    <span>
                      <a className="forgot">FORGOT PASSWORD?</a>
                    </span>
                  </div> */}
                      {this.state.showError ? (
                        <span
                          style={{
                            color: "#bd3131",
                            fontStyle: "italic",
                            cursor: "default",
                          }}
                        >
                          Invalid Username/Password
                        </span>
                      ) : null}
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
                      <div>
                        <input
                          className="loginbtn"
                          type="submit"
                          name="login-submit"
                          value="Log In"
                        />
                      </div>
                    </form>
                    <h3
                      style={{
                        margin: "5px auto 5px auto",
                        color: "#fff",
                        fontWeight: "350",
                      }}
                    >
                      Or Log In with
                    </h3>

                    <div
                      className="google-login"
                    >
                      <a href="http://localhost:5000/auth/google">
                        <>
                          <img
                            src={require("../components/images/google-logo.png")}
                            alt="google-logo"
                          />
                          <h4>Google</h4>
                        </>
                      </a>
                    </div>
                    <div
                      className="spotify-login"
                    >
                      <a href="http://localhost:5000/auth/spotify">
                      <img
                        src={require("../components/images/spotify-logo.png")}
                        alt="spotify-logo"
                      />
                      <h4> Spotify</h4>
                      </a>
                    </div>
                  </>
                )}
              </ContextConsumer>
              <Link to="/signup" className="new_member_text">
                New Member?
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default SignIn;
