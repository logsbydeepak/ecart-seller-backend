import { GQLResolvers } from "~/types";
import { dbReadUserById } from "~/db/query/user.query";
import { handleCatchError } from "~/helper/response.helper";
import { TokenError, TokenErrorType } from "~/types/graphql";

const ReadUser: GQLResolvers = {
  Query: {
    readUser: async (_parent, _args, { req, validateTokenMiddleware }) => {
      try {
        const { userId } = await validateTokenMiddleware(req);

        const dbUser = await dbReadUserById<"readUser">(userId, {
          __typename: "TokenError",
          type: "TokenUserDoNotExistError",
          message: "user do not exist",
        });

        return {
          __typename: "User",
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          email: dbUser.email,
          picture: "default",
        };
      } catch (error) {
        return handleCatchError(error);
      }
    },
  },
};

export default ReadUser;
