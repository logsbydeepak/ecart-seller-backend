import { GQLResolvers } from "~/types/graphqlHelper";
import { handleCatchError } from "~/helper/response.helper";
import { UserModel } from "~/db/model.db";

const ReadUser: GQLResolvers = {
  Query: {
    readUser: async (_parent, _args, { req, validateTokenMiddleware }) => {
      try {
        const { tokenData, tokenError } = await validateTokenMiddleware(req);
        if (tokenError) return tokenError;
        const { userId } = tokenData;

        const dbUser = await UserModel.findById(userId);

        if (!dbUser) {
          return {
            __typename: "TokenError",
            type: "TokenUserDoNotExistError",
            message: "user do not exist",
          };
        }

        return {
          __typename: "User",
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          email: dbUser.email,
          picture: dbUser.picture,
        };
      } catch (error) {
        return handleCatchError();
      }
    },
  },
};

export default ReadUser;
