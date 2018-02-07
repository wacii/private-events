import React from "react";
import PropTypes from "prop-types";

import { login, logout } from "../utils/auth";

class Authentication extends React.Component {
  static contextTypes = {
    authenticated: PropTypes.bool,
    client: PropTypes.object.isRequired
  }

  render() {
    const { authenticated, client } = this.context;
    const logoutAndReset = () => {
      logout();
      client.resetStore();
    };

    return authenticated ? (
      <button onClick={logoutAndReset}>Logout</button>
    ) : (
      <button onClick={login}>Login</button>
    );
  }
}

export default Authentication;
