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
        cookie: ctx.req ? ctx.req.cookies : null
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
        typeof window === "undefined",
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
