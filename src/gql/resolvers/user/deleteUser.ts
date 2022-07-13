import { GQLResolvers } from "~/types/graphqlHelper";

import { UserModel } from "~/db/model.db";
import { redisClient } from "~/config/redis.config";
import { handleCatchError } from "~/helper/response.helper";

const DeleteUser: GQLResolvers = {
  Mutation: {
    deleteUser: async (
      _parent,
      args,
      { req, validateTokenMiddleware, validatePasswordMiddleware }
    ) => {
      try {
        const { userId } = await validateTokenMiddleware(req);
        await validatePasswordMiddleware<"deleteUser">(
          args.currentPassword,
          userId,
          {
            __typename: "DeleteUserCredentialError",
            message: "password is required",
          },
          {
            __typename: "DeleteUserCredentialError",
            message: "invalid password",
          }
        );

        await redisClient.DEL(userId);
        await UserModel.findByIdAndRemove(userId);

        return {
          __typename: "SuccessResponse",
          message: "user deleted",
        };
      } catch (error) {
        return handleCatchError(error);
      }
    },
  },
};

export default DeleteUser;
