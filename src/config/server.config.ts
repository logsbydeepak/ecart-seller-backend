import express, { Express } from "express";
import { ApolloServer } from "apollo-server-express";
import { addResolversToSchema } from "@graphql-tools/schema";

import { gqlSchema } from "@gql/schema";
import { gqlResolver } from "@gql/resolver";
import cookieParser from "cookie-parser";
import helmet from "helmet";

const schemaWithResolvers = addResolversToSchema({
  schema: gqlSchema,
  resolvers: gqlResolver,
});

export const server: Express = express();

server.use(helmet());
server.use(cookieParser());
export const apolloServer = new ApolloServer({
  schema: schemaWithResolvers,
  context: ({ req, res }) => {
    console.log(req.cookies);
    return { res };
  },
});
