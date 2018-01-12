import React from "react";
import { withRouter } from "next/router";

import { handleAuthentication } from "../utils/auth";

class Callback extends React.Component {
  componentDidMount() {
    const { router } = this.props;
    handleAuthentication();
    router.push("/");
  }

  render() {
    return <p>Loading...</p>;
  }
}

export default withRouter(Callback);
