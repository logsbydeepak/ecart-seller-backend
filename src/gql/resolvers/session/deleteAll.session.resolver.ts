import { GQLResolvers } from "~/types";
import { Mutation } from "~/types/graphql";

import { redisClient } from "~/config/redis.config";
import { handleCatchError } from "~/helper/response.helper";

type ResponseType = Mutation["deleteAllSession"];

const DeleteAllSession: GQLResolvers = {
  Mutation: {
    deleteAllSession: async (
      _parent,
      args,
      { req, validateTokenMiddleware, validatePasswordMiddleware }
    ) => {
      try {
        const { userId } = await validateTokenMiddleware(req);
        await validatePasswordMiddleware<ResponseType>(
          args.currentPassword,
          userId,
          {
            __typename: "DeleteAllSessionCredentialError",
            message: "password is required",
          },
          {
            __typename: "DeleteAllSessionCredentialError",
            message: "invalid password",
          }
        );

        await redisClient.DEL(userId);

        return {
          __typename: "SuccessResponse",
          message: "logout from all device successfully",
        };
      } catch (error) {
        return handleCatchError(error);
      }
    },
  },
};

export default DeleteAllSession;
