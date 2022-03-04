import express, { Express } from "express";
import { ApolloServer } from "apollo-server-express";
import { addResolversToSchema } from "@graphql-tools/schema";

import { checkEnv } from "../helper/env.helper";
import { gqlResolver } from "../gql/gql.resolver";
import { gqlSchema } from "../gql/gql.schema";

const schemaWithResolvers = addResolversToSchema({
  schema: gqlSchema,
  resolvers: gqlResolver,
});

export const server: Express = express();
export const apolloServer = new ApolloServer({
  schema: schemaWithResolvers,
});
