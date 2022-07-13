import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import { ApolloServer, ExpressContext } from "apollo-server-express";

import { ALLOW_ORIGIN, NODE_ENV, PORT } from "~/config/env.config";
import validateTokenMiddleware from "~/middleware/validateToken.middleware";
import validatePasswordMiddleware from "~/middleware/validatePassword.middleware";

const loadTypeDefsAndResolvers = async () => {
  const currentPath = __dirname;
  const typeDefsPath = path.join(currentPath, "../gql/typeDefs/**/*");
  const resolverPath = path.join(currentPath, "../gql/resolvers/**/*");

  const { loadFilesSync } = await import("@graphql-tools/load-files");
  const typeDefs = loadFilesSync(typeDefsPath);
  const resolvers = loadFilesSync(resolverPath);

  return { typeDefs, resolvers };
};

const context = ({ req, res }: ExpressContext) => ({
  req,
  res,
  validatePasswordMiddleware,
  validateTokenMiddleware,
});

const startServer = async () => {
  const expressServer = express();
  expressServer.use(cookieParser());
  NODE_ENV === "production" &&
    expressServer.use(async () => await import("helmet"));

  const { typeDefs, resolvers } = await loadTypeDefsAndResolvers();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context,
  });

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
export type GQLContext = ReturnType<typeof context>;
