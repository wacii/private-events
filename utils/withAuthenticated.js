import React from "react";
import PropTypes from "prop-types";

import { ID_TOKEN, subscribeAuthenticated } from "./auth";

// TODO: store in apollo instead of context
const withAuthenticated = Page =>
  class WithAuthenticated extends React.Component {
    static getInitialProps = async ctx => {
      const props = Page.getInitialProps ? await Page.getInitialProps(ctx) : {};

      return {
        cookies: ctx.req ? ctx.req.cookies : null
      };
    };

    static childContextTypes = {
      authenticated: PropTypes.bool
    };

    getChildContext() {
      return { authenticated: this.state.authenticated };
    }

    state = { authenticated: false };

    constructor(props) {
      super(props);
      const authenticated = process.browser ?
        localStorage.getItem(ID_TOKEN) !== null :
        props.cookies.id_token !== undefined;
      this.state = { authenticated };
    }
    
    componentDidMount() {
      this.unsubscribe = subscribeAuthenticated(
        process.browser,
        this.props.cookies,
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
