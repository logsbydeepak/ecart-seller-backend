import path from "path";
import helmet from "helmet";
import express from "express";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { loadFilesSync } from "@graphql-tools/load-files";

import { ALLOW_ORIGIN, NODE_ENV, PORT } from "~/config/env.config";
import validateTokenMiddleware from "~/middleware/validateToken.middleware";
import validatePasswordMiddleware from "~/middleware/validatePassword.middleware";

const isProduction = NODE_ENV === "prod";

const currentPath = __dirname;
const typeDefsPath = path.join(currentPath, "../gql/typeDefs/**/*.gql");
const resolverPath = path.join(
  currentPath,
  "../gql/resolvers/*/**/*.resolver.*"
);

const typeDefs = loadFilesSync(typeDefsPath);
const resolvers = loadFilesSync(resolverPath);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    return {
      req,
      res,
      validatePasswordMiddleware,
      validateTokenMiddleware,
    };
  },
});

const expressServer = express();
expressServer.use(cookieParser());
isProduction && expressServer.use(helmet());

const startServer = async () => {
  await apolloServer.start();

  apolloServer.applyMiddleware({
    app: expressServer,
    cors: {
      origin: ALLOW_ORIGIN,
      credentials: true,
    },
  });

  return expressServer.listen(PORT);
};

export default startServer;
