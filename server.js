const bodyParser = require("body-parser");
const express = require("express");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
const next = require("next");

const PORT = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handler = app.getRequestHandler();

const fakeUsers = [{ id: "first" }, { id: "second" }];
const typeDefs = `
  type Query { users: [User] }
  type User { id: String }
`;
const resolvers = {
  Query: { users: () => fakeUsers }
};
const schema = makeExecutableSchema({ typeDefs, resolvers });

app.prepare().then(() => {
  const server = express();

  server.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));
  server.get("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

  server.get("*", handler);

  server.listen(PORT, err => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
