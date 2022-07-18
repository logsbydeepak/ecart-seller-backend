import { GQLResolvers } from "~/types/graphqlHelper";
import { handleCatchError } from "~/helper/response.helper";
import { redisClient } from "~/config/redis.config";

const DeleteSession: GQLResolvers = {
  Mutation: {
    deleteSession: async (_parent, _args, { req, validateTokenMiddleware }) => {
      try {
        const { userId, token } = await validateTokenMiddleware(req);
        await redisClient.SREM(userId, token);

        return {
          __typename: "SuccessResponse",
          message: "logout success",
        };
      } catch (error) {
        return handleCatchError(error);
      }
    },
  },
};

export default DeleteSession;
