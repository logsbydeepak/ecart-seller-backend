import express, { Express } from "express";
import { ApolloServer } from "apollo-server-express";
import { addResolversToSchema } from "@graphql-tools/schema";

import { gqlSchema } from "@gql/schema";
import { gqlResolver } from "@gql/resolver";

const schemaWithResolvers = addResolversToSchema({
  schema: gqlSchema,
  resolvers: gqlResolver,
});

export const server: Express = express();
export const apolloServer = new ApolloServer({
  schema: schemaWithResolvers,
  context: ({ req, res }) => {
    return { res };
  },
});
