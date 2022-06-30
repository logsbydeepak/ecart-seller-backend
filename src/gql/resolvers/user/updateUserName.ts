import { handleCatchError } from "~/helper/response.helper";
import { validateEmpty } from "~/helper/validator.helper";

import { GQLResolvers } from "~/types/index";
import { dbReadUserById } from "~/db/query/user.query";

const updateUserName: GQLResolvers = {
  Mutation: {
    updateUserName: async (
      _parent,
      args,
      { req, validateTokenMiddleware, validatePasswordMiddleware }
    ) => {
      try {
        const { userId } = await validateTokenMiddleware(req);

        await validatePasswordMiddleware<"updateUserName">(
          args.currentPassword,
          userId,
          {
            __typename: "UpdateUserNameCredentialError",
            field: "currentPassword",
            message: "currentPassword is required",
          },
          {
            __typename: "UpdateUserInvalidUserCredentialError",
            message: "currentPassword is invalid",
          }
        );

        const firstName = validateEmpty<"updateUserName">(args.firstName, {
          __typename: "UpdateUserNameCredentialError",
          field: "firstName",
          message: "firstName is required",
        });

        const lastName = validateEmpty<"updateUserName">(args.lastName, {
          __typename: "UpdateUserNameCredentialError",
          field: "lastName",
          message: "lastName is required",
        });

        const dbUser = await dbReadUserById<"updateUserName">(userId, {
          __typename: "TokenError",
          type: "TokenUserDoNotExistError",
          message: "user do not exist",
        });

        dbUser.firstName = firstName;
        dbUser.lastName = lastName;
        await dbUser.save();

        return {
          __typename: "UpdateUserNameSuccessResponse",
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
        };
      } catch (error) {
        return handleCatchError(error);
      }
    },
  },
};

export default updateUserName;
