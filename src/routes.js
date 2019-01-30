import React, { Component, Fragment } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import App from "./App";
import Login from "./containers/Login";
import UserProfile from "./containers/UserProfile";
import SinglePost from "./containers/SinglePost";
import { ToastContainer } from "react-toastify";
import NavComponent from "./components/NavComponent";
import "react-toastify/dist/ReactToastify.css";
import { isLoggedIn } from "./utils";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const authenticated = isLoggedIn() ? true : false;

  return (
    <Route
      {...rest}
      render={props =>
        authenticated === true ? (
          <Fragment>
            <NavComponent />
            <Component {...props} />
          </Fragment>
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

const PublicRoute = ({ component: Component, ...rest }) => {
  const authenticated = isLoggedIn() ? true : false;
  return (
    <Route
      {...rest}
      render={props =>
        !authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/userprofile", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default class Routes extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <Redirect
                  to={{
                    pathname: "/userprofile",
                    state: { from: props.location }
                  }}
                />
              )}
            />
            <PublicRoute exact path="/login" component={Login} />
            <PrivateRoute exact path="/userprofile" component={UserProfile} />
            <PrivateRoute exact path="/posts/:id" component={SinglePost} />
          </Switch>
        </BrowserRouter>
        <ToastContainer autoClose={3000} />
      </div>
    );
  }
}
