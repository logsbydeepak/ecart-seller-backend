import { validateEmail } from "~/helper/validator.helper";
import { handleCatchError } from "~/helper/response.helper";

import { GQLResolvers } from "~/types/graphqlHelper";
import { dbEmailExist, dbReadUserById } from "~/db/query/user.query";

const updateUserEmail: GQLResolvers = {
  Mutation: {
    updateUserEmail: async (
      _parent,
      args,
      { req, validateTokenMiddleware, validatePasswordMiddleware }
    ) => {
      try {
        const { userId } = await validateTokenMiddleware(req);
        await validatePasswordMiddleware<"updateUserEmail">(
          userId,
          args.currentPassword,
          {
            __typename: "UpdateUserEmailCredentialError",
            field: "currentPassword",
            message: "currentPassword is required",
          },
          {
            __typename: "UpdateUserInvalidUserCredentialError",
            message: "currentPassword is invalid",
          }
        );

        const email = validateEmail<"updateUserEmail">(
          args.email,
          {
            __typename: "UpdateUserEmailCredentialError",
            field: "email",
            message: "email is required",
          },
          {
            __typename: "UpdateUserEmailCredentialError",
            field: "email",
            message: "email is invalid",
          }
        );

        await dbEmailExist<"updateUserEmail">(email, {
          __typename: "UserAlreadyExistError",
          message: "email already exist",
        });

        const dbUser = await dbReadUserById<"updateUserEmail">(userId, {
          __typename: "TokenError",
          type: "TokenUserDoNotExistError",
          message: "user do not exist",
        });

        dbUser.email = email;
        await dbUser.save();

        return {
          __typename: "UpdateUserEmailSuccessResponse",
          email: dbUser.email,
        };
      } catch (error) {
        return handleCatchError(error);
      }
    },
  },
};

export default updateUserEmail;
