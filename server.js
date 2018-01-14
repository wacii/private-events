const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const jwksRsa = require("jwks-rsa");
const jwtMiddleware = require("express-jwt");
const next = require("next");

const schema = require("./schema");

const PORT = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(cookieParser());

  server.use("/graphql",
    bodyParser.json(),
    jwtMiddleware({
      secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://wacii.auth0.com/.well-known/jwks.json"
      }),
      algorithms: ["RS256"]
    }),
    graphqlExpress(({ user }) =>  ({
      context: { user },
      schema
    }))
  );
  server.get("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

  server.get("*", handler);

  server.listen(PORT, err => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
