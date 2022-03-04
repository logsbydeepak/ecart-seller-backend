import express, { Express } from "express";
import { ApolloServer } from "apollo-server-express";

import { checkEnv } from "../helper/env.helper";
import { userTypeDefs } from "../graphql/user/user.typeDefs";
import { userResolver } from "../graphql/user/user.resolver";

const typeDefs = [userTypeDefs];
const resolvers = [userResolver];

checkEnv();

export const server: Express = express();
export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});
