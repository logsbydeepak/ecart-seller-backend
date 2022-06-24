import { GQLResolvers } from "~/types";
import { dbReadUserById } from "~/db/query/user.query";
import { handleCatchError } from "~/helper/response.helper";
import { TokenError, TokenErrorType } from "~/types/graphql";

const TokenUserDoNotExistError: TokenError = {
  __typename: "TokenError",
  type: TokenErrorType.TokenUserDoNotExistError,
  message: "user do not exist",
};

const ReadUser: GQLResolvers = {
  Query: {
    readUser: async (_parent, _args, { req, validateTokenMiddleware }) => {
      try {
        const { userId } = await validateTokenMiddleware(req);
        const dbUser = await dbReadUserById(userId, TokenUserDoNotExistError);

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
