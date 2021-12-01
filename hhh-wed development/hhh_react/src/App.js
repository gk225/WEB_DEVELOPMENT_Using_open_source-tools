import React from "react";
import { Route, Switch } from "react-router-dom";
import { ContextConsumer } from "./components/Context";
import Header from "./components/Header";
import WebPlayer from "./pages/WebPlayer/WebPlayer";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import OrderHistory from "./pages/Orders/OrderHistory";
import Tours from "./pages/Tours/Tours";
import MainPage from "./pages/MainPage";
import Merchs from "./pages/Merch/Merchs";
import Cart from "./pages/Cart/Cart";
import { Helmet } from "react-helmet";
import SingleMerch from "./pages/SingleMerch/SingleMerch";
import WalletRecharge from "./pages/Wallet/WalletRecharge";
import TicketCheckout from "./pages/Checkout/TicketCheckout";
import MerchSingleCheckout from "./pages/Checkout/MerchSingleCheckout";
import MerchCheckout from "./pages/Checkout/MerchCheckout";
import FloatingFooter from "./components/FloatingFooter";
import Footer from "./components/Footer";
import Wallet from "./pages/wallet";

/*
class AppProvider extends React.Component {
  state = {
    user_id: "",
    cart: {},
    wallet: 100,
    addToCart: (productid) => {
      console.log(productid);
      this.setState(() => {
        return { cart: [...this.state.cart, productid] };
      });
    },
  };
  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}
*/
class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div>
          <ContextConsumer>
            {(context) => {
              return (
                <Switch>
                  <Route path="/orders">
                    <OrderHistory user={context.user} context={context} />
                    <Helmet>
                      <title>Orders | HHH</title>
                    </Helmet>
                    {/* Because we always want the OrderHistory page to have the context*/}
                  </Route>
                  <Route path="/cart">
                    <Cart
                      user={context.user}
                      signed_in={context.signed_in}
                      context={context}
                    />
                    <Helmet>
                      <title>Cart | HHH</title>
                    </Helmet>
                  </Route>
                  <Route path="/merch/:product_id">
                    <SingleMerch context={context} />
                  </Route>
                  <Route path="/signin">
                    <SignIn context={context} />
                    <Helmet>
                      <title>Sign In | HHH</title>
                    </Helmet>
                  </Route>
                  <Route path="/checkout/merch">
                    <MerchCheckout context={context} />
                  </Route>
                  <Route path="/checkout/ticket">
                    <TicketCheckout context={context} />
                  </Route>
                  <Route path="/checkout/singlemerch">
                    <MerchSingleCheckout context={context} />
                  </Route>
                  <Route exact path="/wallet">
                    <Wallet context={context} />
                  </Route>
                  <Route
                    path="/wallet/addToWallet"
                    render={(props) => (
                      <WalletRecharge context={context} {...props} />
                    )}
                  />
                </Switch>
              );
            }}
          </ContextConsumer>
          <Switch>
            <Route exact path="/">
              <Helmet>
                <title>HHH</title>
              </Helmet>
              <MainPage />
              <Footer />
              <FloatingFooter />
            </Route>
            <Route path="/passes">
              <Helmet>
                <title>Tours | HHH</title>
              </Helmet>
              <Tours />
              <Footer />
            </Route>
            <Route exact path="/merch">
               <Helmet>
                <title>Merch | HHH</title>
              </Helmet>
              <Merchs />
              <Footer /> 
            </Route>
            <Route path="/signup">
              <Helmet>
                <title>Sign Up | HHH</title>
              </Helmet>
              <SignUp />
            </Route>
            <Route path="/webPlayer">
              <WebPlayer />
              <Footer />
              <FloatingFooter />
            </Route>
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
