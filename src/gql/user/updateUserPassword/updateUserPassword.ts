import { handleCatchError } from "~/helper/response.helper";
import { validatePassword } from "~/helper/validator.helper";

import { GQLResolvers } from "~/types/index";
import { dbReadUserById } from "~/db/query/user.query";

const updateUserPassword: GQLResolvers = {
  Mutation: {
    updateUserPassword: async (
      _parent,
      args,
      { req, validateTokenMiddleware, validatePasswordMiddleware }
    ) => {
      try {
        const { userId } = await validateTokenMiddleware(req);
        await validatePasswordMiddleware<"updateUserPassword">(
          userId,
          args.currentPassword,
          {
            __typename: "UpdateUserPasswordCredentialError",
            field: "currentPassword",
            message: "currentPassword is required",
          },
          {
            __typename: "UpdateUserInvalidUserCredentialError",
            message: "currentPassword is invalid",
          }
        );

        const password = validatePassword<"updateUserPassword">(
          args.password,
          {
            __typename: "UpdateUserPasswordCredentialError",
            field: "password",
            message: "password is required",
          },
          {
            __typename: "UpdateUserPasswordCredentialError",
            field: "password",
            message: "password is invalid",
          }
        );

        const dbUser = await dbReadUserById<"updateUserPassword">(userId, {
          __typename: "TokenError",
          type: "TokenUserDoNotExistError",
          message: "user do not exist",
        });

        dbUser.password = password;
        await dbUser.save();

        return {
          __typename: "UpdateUserPasswordSuccessResponse",
          message: "password updated",
        };
      } catch (error) {
        return handleCatchError(error);
      }
    },
  },
};

export default updateUserPassword;
