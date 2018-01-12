import React from "react";

import { subscribeAuthenticated, login, logout } from "../utils/auth";

class Authentication extends React.Component {
  state = {
    loading: true,
    authenticated: null
  };

  componentDidMount() {
    this.setState({ loading: false });
    this.unsubscribe = subscribeAuthenticated(authenticated => {
      this.setState({ authenticated: authenticated });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
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
