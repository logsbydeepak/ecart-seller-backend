import * as yup from "yup";

import { UserModel } from "~/db/model.db";
import { redisClient } from "~/config/redis.config";
import { GQLResolvers } from "~/types/graphqlHelper";
import { handleCatchError } from "~/helper/response.helper";
import { validateHashAndSalt } from "~/helper/security.helper";
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

        const validatePassword = await validateHashAndSalt({
          rawPassword: argsData.currentPassword,
          dbPassword: dbUser.password,
        });

        if (!validatePassword) {
          return {
            __typename: "DeleteUserCredentialError",
            field: "currentPassword",
            message: "invalid password",
          };
        }

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
