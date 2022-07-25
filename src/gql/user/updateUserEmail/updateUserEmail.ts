import * as yup from "yup";

import { UserModel } from "~/db/model.db";
import { GQLResolvers } from "~/types/graphqlHelper";

import { handleCatchError } from "~/helper/response.helper";
import { email, password, validateArgs } from "~/helper/validator.helper";
import { TokenUserDoNotExistError } from "~/helper/error.helper";
import { validatePassword } from "~/helper/security.helper";

const validateSchema = yup.object({
  email,
  currentPassword: password,
});

const updateUserEmail: GQLResolvers = {
  Mutation: {
    updateUserEmail: async (
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
            argsError.field !== "email" &&
            argsError.field !== "currentPassword"
          ) {
            throw Error();
          }

          return {
            __typename: "UpdateUserEmailArgsError",
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
            __typename: "InvalidCredentialError",
            message: "invalid credential",
          };

        const isEmailExist = await UserModel.exists({
          email: argsData.email,
        });

        if (isEmailExist)
          return {
            __typename: "UserAlreadyExistError",
            message: "email already exist",
          };

        const dbUpdateUserEmail = await UserModel.findByIdAndUpdate(userId, {
          email: argsData.email,
        });
        if (!dbUpdateUserEmail) return TokenUserDoNotExistError;

        return {
          __typename: "UpdateUserEmailSuccessResponse",
          email: dbUser.email,
        };
      } catch (error) {
        return handleCatchError();
      }
    },
  },
};

export default updateUserEmail;
