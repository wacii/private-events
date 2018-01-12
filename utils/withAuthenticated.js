import React from "react";
import PropTypes from "prop-types";

import { subscribeAuthenticated } from "./auth";

// TODO: store in apollo instead of context
const withAuthenticated = Page =>
  class WithAuthenticated extends React.Component {
    static getInitialProps = async ctx => {
      const props = await Page.getInitialProps && Page.getInitialProps(ctx);
      return {
        ...props,
        isServer: !!ctx.req,
        cookie: ctx.req && ctx.req.headers.cookie
      };
    };

    static childContextTypes = {
      authenticated: PropTypes.bool
    };

    getChildContext() {
      return { authenticated: this.state.authenticated };
    }

    state = { authenticated: false };
    
    componentDidMount() {
      this.unsubscribe = subscribeAuthenticated(
        this.props.isServer,
        this.props.cookie,
        authenticated => {
          this.setState({ authenticated: authenticated });
        }
      );
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      return <Page {...this.props} />;
    }
  };

  export default withAuthenticated;