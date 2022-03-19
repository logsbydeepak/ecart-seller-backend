import helmet from "helmet";
import express, { Express } from "express";
import { ApolloServer } from "apollo-server-express";
import { addResolversToSchema } from "@graphql-tools/schema";

import { helmetOption } from "helper";
import cookieParser from "cookie-parser";
import { gqlSchema, gqlResolver } from "gql";

const schemaWithResolvers = addResolversToSchema({
  schema: gqlSchema,
  resolvers: gqlResolver,
});

export const server: Express = express();

// server.use(helmet(helmetOption));
server.use(cookieParser());

export const apolloServer = new ApolloServer({
  schema: schemaWithResolvers,

  context: ({ req, res }) => {
    return { req, res };
  },
});
