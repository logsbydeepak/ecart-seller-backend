import helmet from "helmet";
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import { ApolloServer } from "apollo-server-express";
import { addResolversToSchema } from "@graphql-tools/schema";

import gqlSchema from "~/gql/gql.schema";
import gqlResolver from "~/gql/gql.resolver";
import { NODE_ENV } from "~/config/env.config";
import validatePasswordMiddleware from "~/middleware/validatePassword.middleware";
import validateAccessTokenMiddleware from "~/middleware/validateAccessToken.middleware";

const isProduction = NODE_ENV === "prod";

const schemaWithResolvers = addResolversToSchema({
  schema: gqlSchema,
  resolvers: gqlResolver,
});

export const server: Express = express();
server.use(cookieParser());
isProduction && server.use(helmet());

export const apolloServer = new ApolloServer({
  schema: schemaWithResolvers,

  context: ({ req, res }) => {
    return {
      req,
      res,
      validatePasswordMiddleware,
      validateAccessTokenMiddleware,
    };
  },
});
