import { ApolloError } from "apollo-server-express";

export const handleCatchError = () => {
  throw new ApolloError("Something went wrong");
};
