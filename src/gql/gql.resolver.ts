import { GQLContext } from "~/types";
import { Resolvers } from "~/types/graphql";

import {
  productMutationResolver,
  productQueryResolver,
} from "./product/product.resolver";

import { reviewQueryResolver } from "./review/review.resolver";
import { sessionMutationResolver } from "./session/session.resolver";
import { userQueryResolver, userMutationResolver } from "./user/user.resolver";

const gqlResolver: Resolvers<GQLContext> = {
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

export default gqlResolver;
