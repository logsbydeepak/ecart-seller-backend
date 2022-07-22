import * as yup from "yup";

import { UserModel } from "~/db/model.db";
import { redisClient } from "~/config/redis.config";
import { GQLResolvers } from "~/types/graphqlHelper";
import { handleCatchError } from "~/helper/response.helper";
import { validateHashAndSalt } from "~/helper/security.helper";
import { TokenUserDoNotExistError } from "~/helper/error.helper";
import { password, validateData } from "~/helper/validator.helper";

const validateSchema = yup.object({
  currentPassword: password,
});

const DeleteUser: GQLResolvers = {
  Mutation: {
    deleteUser: async (_parent, args, { req, validateTokenMiddleware }) => {
      try {
        const validateToken = await validateTokenMiddleware(req);
        if (validateToken.isError) return validateToken.error;
        const { userId } = validateToken;

        const validatedArgs = await validateData<typeof validateSchema>(
          validateSchema,
          args
        );

        if (validatedArgs.isError) {
          return {
            __typename: "DeleteUserArgsError",
            field: "currentPassword",
            message: validatedArgs.error.message,
          };
        }

        const dbUser = await UserModel.findById(userId);
        if (!dbUser) {
          return TokenUserDoNotExistError;
        }

        const validatePassword = await validateHashAndSalt({
          rawPassword: validatedArgs.data.currentPassword,
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
