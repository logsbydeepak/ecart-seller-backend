import * as yup from "yup";
import { UserModel } from "~/db/model.db";
import { TokenUserDoNotExistError } from "~/helper/error.helper";

import { GQLResolvers } from "~/types/graphqlHelper";
import { handleCatchError } from "~/helper/response.helper";
import { MutationUpdateUserNameArgs } from "~/types/graphql";
import { firstName, lastName, validateArgs } from "~/helper/validator.helper";

const validateSchema = yup.object({
  firstName,
  lastName,
});

const updateUserName: GQLResolvers = {
  Mutation: {
    updateUserName: async (_parent, args, { req, validateTokenMiddleware }) => {
      try {
        const { tokenData, tokenError } = await validateTokenMiddleware(req);
        if (tokenError) return tokenError;
        const { userId } = tokenData;

        const { argsData, argsError } = await validateArgs(
          validateSchema,
          args
        );

        if (argsError) {
          if (
            argsError.field !== "firstName" &&
            argsError.field !== "lastName"
          ) {
            throw new Error();
          }

          return {
            __typename: "UpdateUserNameArgsError",
            field: argsError.field,
            message: argsError.message,
          };
        }

        const dbUser = await UserModel.findByIdAndUpdate(userId, {
          firstName: argsData.firstName,
          lastName: argsData.lastName,
        });

        if (!dbUser) return TokenUserDoNotExistError;

        return {
          __typename: "UpdateUserNameSuccessResponse",
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
        };
      } catch (error) {
        return handleCatchError();
      }
    },
  },
};

export default updateUserName;
