import express, { Express } from "express";
import { ApolloServer } from "apollo-server-express";
import { addResolversToSchema } from "@graphql-tools/schema";

import { gqlSchema } from "@gql/schema";
import { gqlResolver } from "@gql/resolver";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { helmetOption } from "@helper/server";

const schemaWithResolvers = addResolversToSchema({
  schema: gqlSchema,
  resolvers: gqlResolver,
});

export const server: Express = express();

server.use(helmet(helmetOption));
server.use(cookieParser());

export const apolloServer = new ApolloServer({
  schema: schemaWithResolvers,

  context: ({ req, res }) => {
    return { req, res };
  },
});
