import React from "react";

import { isAuthenticated, login, logout } from "../utils/auth";

class Authentication extends React.Component {
  state = {
    loading: true,
    authenticated: null
  };

  componentDidMount() {
    this.setState({
      loading: false,
      authenticated: isAuthenticated()
    });
  }

  render() {
    const { authenticated, loading } = this.state;

    if (loading) {
      return <p>Loading...</p>;
    }

    return authenticated ? (
      <button onClick={logout}>Logout</button>
    ) : (
      <button onClick={login}>Login</button>
    );
  }
}

export default Authentication;
