const { makeExecutableSchema } = require("graphql-tools");

const fakeUsers = [{ id: "first" }, { id: "second" }];
const typeDefs = `
  type Query { users: [User] }
  type User { id: String }
`;
const resolvers = {
  Query: { users: () => fakeUsers }
};
const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = schema;
