import { GQLContext } from "types";
import { Resolvers } from "types/graphql";
import { userQueryResolver, userMutationResolver } from "./user/user.resolver";
import { sessionMutationResolver } from "./session/session.resolver";
import { reviewQueryResolver } from "./review/review.resolver";
import {
  productMutationResolver,
  productQueryResolver,
} from "./product/product.resolver";

export const gqlResolver: Resolvers<GQLContext> = {
  Query: {
    ...userQueryResolver,
    ...productQueryResolver,
    ...reviewQueryResolver,
  },
  Mutation: {
    ...userMutationResolver,
    ...sessionMutationResolver,
    ...productMutationResolver,
  },
};
