const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");
const { makeExecutableSchema } = require("graphql-tools");

const { Event } = require("./db");

const typeDefs = `
  scalar Date

  type Query { events: [Event] }

  type Event {
    id: ID

    user_id: String
    name: String
    location: String
    date: Date

    created_at: Date
    updated_at: Date
  }
`;
const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Postgres timestamp with timezone',
    parseValue(value) {
      return Date.parse(value);
    },
    serialize(value) {
      return value.toISOString();
    },
    parseLiteral(ast) {
      return ast.kind === Kind.STRING ? ast.value : undefined;
    },
  }),
  Query: {
    events(_obj, _args, context) {
      const { userId } = context.user;
      return Event.findAll({
        where: { userId: userId }
      });
    }
  }
};
const schema = makeExecutableSchema({ typeDefs, resolvers });

// HACK: so you can access in withApollo
global.schema = schema;

module.exports = schema;
