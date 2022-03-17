import { GQLContext } from "types";
import { Resolvers } from "types/graphql";
import { userResolver } from "./user/user.resolver";
import { sessionResolver } from "./session/sesion.resolver";

export const gqlResolver: Resolvers<GQLContext> = {
  ...userResolver,
  ...sessionResolver,
};
