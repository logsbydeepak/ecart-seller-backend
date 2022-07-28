import * as yup from "yup";

import { UserModel } from "~/db/model.db";
import { redisClient } from "~/config/redis.config";
import { GQLResolvers } from "~/types/graphqlHelper";
import { validatePassword } from "~/helper/security.helper";
import { handleCatchError } from "~/helper/response.helper";
import { TokenUserDoNotExistError } from "~/helper/error.helper";
import { password, validateArgs } from "~/helper/validator.helper";

const validateSchema = yup.object({
  currentPassword: password,
});

const DeleteUser: GQLResolvers = {
  Mutation: {
    deleteUser: async (_parent, args, { req, validateTokenMiddleware }) => {
      try {
        const { tokenData, tokenError } = await validateTokenMiddleware(req);
        if (tokenError) return tokenError;
        const { userId } = tokenData;

        const { argsData, argsError } = await validateArgs(
          validateSchema,
          args
        );

        if (argsError) {
          if (argsError.field !== "currentPassword") {
            throw Error();
          }

          return {
            __typename: "DeleteUserArgsError",
            field: argsError.field,
            message: argsError.message,
          };
        }

        const dbUser = await UserModel.findById(userId);
        if (!dbUser) {
          return TokenUserDoNotExistError;
        }

        const isValidPassword = validatePassword({
          rawPassword: argsData.currentPassword,
          dbPassword: dbUser.password,
        });

        if (!isValidPassword)
          return {
            __typename: "InvalidCredentialError",
            message: "invalid credential",
          };

        await redisClient.DEL(userId);
        await UserModel.findByIdAndRemove(userId);

        return {
          __typename: "SuccessResponse",
          message: "user deleted",
        };
      } catch (error) {
        return handleCatchError();
      }
    },
  },
};

export default DeleteUser;
