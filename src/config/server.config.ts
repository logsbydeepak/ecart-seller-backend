import path from "path";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import { ApolloServer } from "apollo-server-express";
import { loadFilesSync } from "@graphql-tools/load-files";

import { NODE_ENV } from "~/config/env.config";
import validatePasswordMiddleware from "~/middleware/validatePassword.middleware";
import validateAccessTokenMiddleware from "~/middleware/validateAccessToken.middleware";

const isProduction = NODE_ENV === "prod";

const currentPath = __dirname;
const typeDefsPath = path.join(currentPath, "../gql/typeDefs/**/*.gql");
const resolverPath = path.join(
  currentPath,
  "../gql/resolvers/*/**/*.resolver.*"
);

const typeDefs = loadFilesSync(typeDefsPath);
const resolvers = loadFilesSync(resolverPath);

export const server: Express = express();
server.use(cookieParser());
isProduction && server.use(helmet());

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    return {
      req,
      res,
      validatePasswordMiddleware,
      validateAccessTokenMiddleware,
    };
  },
});
