import React from "react";
import PropTypes from "prop-types";

import { login, logout } from "../utils/auth";

class Authentication extends React.Component {
  static contextTypes = {
    authenticated: PropTypes.bool
  }

  render() {
    const { authenticated } = this.context;

    return authenticated ? (
      <button onClick={logout}>Logout</button>
    ) : (
      <button onClick={login}>Login</button>
    );
  }
}

export default Authentication;
