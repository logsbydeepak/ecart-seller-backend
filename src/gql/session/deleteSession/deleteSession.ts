import { redisClient } from "~/config/redis.config";
import { GQLResolvers } from "~/types/graphqlHelper";
import { handleCatchError } from "~/helper/response.helper";

const DeleteSession: GQLResolvers = {
  Mutation: {
    deleteSession: async (_parent, _args, { req, validateTokenMiddleware }) => {
      try {
        const { tokenData, tokenError } = await validateTokenMiddleware(req);
        if (tokenError) return tokenError;
        const { userId, token } = tokenData;

        await redisClient.SREM(userId, token);

        return {
          __typename: "SuccessResponse",
          message: "logout success",
        };
      } catch (error) {
        return handleCatchError();
      }
    },
  },
};

export default DeleteSession;
