import React from "react";

import Authentication from "../components/Authentication";
import withAuthenticated from "../utils/withAuthenticated";

class IndexComponent extends React.Component {
  render() {
    return <Authentication />;
  }
}

export default withAuthenticated(IndexComponent);
