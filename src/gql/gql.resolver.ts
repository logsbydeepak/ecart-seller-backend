import { GQLContext } from "types";
import { Resolvers } from "types/graphql";
import { userQueryResolver, userMutationResolver } from "./user/user.resolver";
import { sessionMutationResolver } from "./session/sesion.resolver";

export const gqlResolver: Resolvers<GQLContext> = {
  Query: {
    ...userQueryResolver,
  },
  Mutation: {
    ...userMutationResolver,
    ...sessionMutationResolver,
  },
};
