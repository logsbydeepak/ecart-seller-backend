import * as yup from "yup";

import { UserModel } from "~/db/model.db";
import { GQLResolvers } from "~/types/graphqlHelper";

import { handleCatchError } from "~/helper/response.helper";
import { email, validateArgs } from "~/helper/validator.helper";
import { TokenUserDoNotExistError } from "~/helper/error.helper";

const validateSchema = yup.object({
  email,
});

const updateUserEmail: GQLResolvers = {
  Mutation: {
    updateUserEmail: async (
      _parent,
      args,
      { req, validateTokenMiddleware }
    ) => {
      try {
        const { tokenData, tokenError } = await validateTokenMiddleware(req);
        if (tokenError) return tokenError;
        const { userId } = tokenData;

        const { argsData, argsError } = await validateArgs(
          validateSchema,
          args
        );
        if (argsError) {
          if (argsError.field !== "email") {
            throw Error();
          }

          return {
            __typename: "UpdateUserEmailArgsError",
            field: argsError.field,
            message: argsError.message,
          };
        }

        const isEmailExist = await UserModel.exists({
          email: argsData.email,
        });

        if (isEmailExist)
          return {
            __typename: "UserAlreadyExistError",
            message: "email already exist",
          };

        const dbUser = await UserModel.findByIdAndUpdate(userId, {
          email: argsData.email,
        });
        if (!dbUser) return TokenUserDoNotExistError;

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
