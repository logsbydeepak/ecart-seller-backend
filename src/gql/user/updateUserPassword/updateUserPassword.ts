import * as yup from "yup";
import { UserModel } from "~/db/model.db";
import { TokenUserDoNotExistError } from "~/helper/error.helper";
import { handleCatchError } from "~/helper/response.helper";
import { validatePassword } from "~/helper/security.helper";
import { password, validateArgs } from "~/helper/validator.helper";
import { GQLResolvers } from "~/types/graphqlHelper";

const validateSchema = yup.object({
  currentPassword: password,
  password,
});

const updateUserPassword: GQLResolvers = {
  Mutation: {
    updateUserPassword: async (
      _parent,
      args,
      { req, validateTokenMiddleware }
    ) => {
      try {
        const { argsData, argsError } = await validateArgs(
          validateSchema,
          args
        );
        if (argsError) {
          if (
            argsError.field !== "currentPassword" &&
            argsError.field !== "password"
          ) {
            throw new Error();
          }

          return {
            __typename: "UpdateUserPasswordArgsError",
            field: argsError.field,
            message: argsError.message,
          };
        }

        const { tokenData, tokenError } = await validateTokenMiddleware(req);
        if (tokenError) return tokenError;
        const { userId } = tokenData;

        const dbUser = await UserModel.findById(userId);
        if (!dbUser) return TokenUserDoNotExistError;

        const isValidPassword = validatePassword({
          rawPassword: argsData.currentPassword,
          dbPassword: dbUser.password,
        });

        if (!isValidPassword)
          return {
            __typename: "UpdateUserPasswordCredentialError",
            field: "currentPassword",
            message: "invalid credential",
          };

        const updatePassword = await UserModel.findByIdAndUpdate(userId, {
          password: argsData.password,
        });
        if (!updatePassword) return TokenUserDoNotExistError;

        return {
          __typename: "SuccessResponse",
          message: "password updated",
        };
      } catch (error) {
        return handleCatchError();
      }
    },
  },
};

export default updateUserPassword;
