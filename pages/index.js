import React from "react";

import Authentication from "../components/Authentication";
import withApollo from "../utils/withApollo";
import withAuthenticated from "../utils/withAuthenticated";

class IndexComponent extends React.Component {
  render() {
    return <Authentication />;
  }
}

export default withApollo(withAuthenticated(IndexComponent));
