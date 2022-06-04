import path from "path";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { loadFilesSync } from "@graphql-tools/load-files";

import { ALLOW_ORIGIN, NODE_ENV, PORT } from "~/config/env.config";
import validatePasswordMiddleware from "~/middleware/validatePassword.middleware";
import validateAccessTokenMiddleware from "~/middleware/validateAccessToken.middleware";
import logger from "./logger.config";

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
      validateAccessTokenMiddleware,
    };
  },
});

const expressServer = express();
expressServer.use(cookieParser());
isProduction && expressServer.use(helmet());

apolloServer.applyMiddleware({
  app: expressServer,
  cors: {
    origin: ALLOW_ORIGIN,
    credentials: true,
  },
});

const startServer = async () => {
  await apolloServer.start();

  expressServer.listen(PORT, () => {
    logger.info(`Server is listening on http://localhost:${PORT}/graphql`);
  });
};

export default startServer;
