import React from "react";
import { ApolloClient } from "apollo-client";
import { ApolloProvider, getDataFromTree } from "react-apollo";
import Head from 'next/head'
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { SchemaLink } from "apollo-link-schema";

import schema from "../schema";

const CLIENT_KEY = "with-apollo/client";
const isServer = !process.browser;

const createBrowserClient = (initialState = {}) =>
  new ApolloClient({
    cache: new InMemoryCache().restore(initialState),
    link: new HttpLink()
  });

const createServerClient = (initialState = {}) =>
  new ApolloClient({
    cache: new InMemoryCache().restore(initialState),
    connectToDevTools: false,
    link: new SchemaLink({ schema }),
    ssrMode: true
  });

const withApollo = Page =>
  class WithApollo extends React.Component {
    static async getInitialProps(ctx) {
      const props = Page.getInitialProps ? await Page.getInitialProps(ctx) : {};

      if (isServer) {
        const client = createServerClient();
        try {
          await getDataFromTree(
            <ApolloProvider client={client}>
              <Page props={props} />
            </ApolloProvider>
          );
        } catch (error) { 
          /* graphql errors should not stop response */
          console.error(error)
        }
        // TODO: is the following necessary?
        Head.rewind();
        props.clientData = client.cache.extract();
      }
      return props;
    }

    constructor(props) {
      super(props);

      if (isServer) {
        this.client = createServerClient(props.clientData);
      } else {
        this.client = window[CLIENT_KEY] || createBrowserClient(props.clientData);
      }
    }

    render() {
      return (
        <ApolloProvider client={this.client}>
          <Page {...this.props} />
        </ApolloProvider>
      );
    }
  };

export default withApollo;