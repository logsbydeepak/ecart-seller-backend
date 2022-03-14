import { GQLContext } from "types";
import { Resolvers } from "types/graphql";
import { userResolver } from "./user/user.resolver";

export const gqlResolver: Resolvers<GQLContext> = {
  ...userResolver,
};
