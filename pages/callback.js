import React from "react";
import { withRouter } from "next/router";

import { parseHash, setSession } from "../utils/auth";

class Callback extends React.Component {
  componentDidMount() {
    const { router } = this.props;
    
    parseHash((err, result) => {
      if (err) {
        console.error(err);
      } else {
        setSession(result);
      }
      router.push("/");
    });
  }

  render() {
    return <p>Loading...</p>;
  }
}

export default withRouter(Callback);
