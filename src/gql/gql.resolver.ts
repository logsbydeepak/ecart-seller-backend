import { GQLContext } from "types";
import { Resolvers } from "types/graphql";
import { userQueryResolver, userMutationResolver } from "./user/user.resolver";
import { sessionMutationResolver } from "./session/sesion.resolver";
import {
  productMutationResolver,
  productQueryResolver,
} from "./product/product.resolver";

export const gqlResolver: Resolvers<GQLContext> = {
  Query: {
    ...userQueryResolver,
    ...productQueryResolver,
  },
  Mutation: {
    ...userMutationResolver,
    ...sessionMutationResolver,
    ...productMutationResolver,
  },
};
