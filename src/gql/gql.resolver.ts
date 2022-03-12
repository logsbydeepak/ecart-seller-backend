import { Response } from "express";
import { Resolvers } from "types/graphql";
import { userResolver } from "./user/user.resolver";

export type GQLContext = {
  res: Response;
};

export const gqlResolver: Resolvers<GQLContext> = {
  ...userResolver,
};
