const bodyParser = require("body-parser");
const express = require("express");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const next = require("next");

const schema = require("./schema");

const PORT = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handler = app.getRequestHandler();

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
