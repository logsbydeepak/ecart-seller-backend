import * as yup from "yup";

import { UserModel } from "~/db/model.db";
import { redisClient } from "~/config/redis.config";
import { GQLResolvers } from "~/types/graphqlHelper";
import { handleCatchError } from "~/helper/response.helper";
import { validateHashAndSalt } from "~/helper/security.helper";

const DeleteUser: GQLResolvers = {
  Mutation: {
    deleteUser: async (_parent, args, { req, validateTokenMiddleware }) => {
      try {
        const validateToken = await validateTokenMiddleware(req);
        if (validateToken.isError) return validateToken.error;
        const { userId } = validateToken;

        const validatedArgs = await validatePasswordArgs(args.currentPassword);
        if (validatedArgs instanceof yup.ValidationError) {
          return {
            __typename: "DeleteUserCredentialError",
            message: validatedArgs.message,
          };
        }

        const dbUser = await UserModel.findById(userId);
        if (!dbUser) {
          return {
            __typename: "TokenError",
            type: "TokenUserDoNotExistError",
            message: "user do not exist",
          };
        }

        const validatePassword = await validateHashAndSalt({
          rawPassword: validatedArgs.password,
          dbPassword: dbUser.password,
        });

        if (!validatePassword) {
          return {
            __typename: "DeleteUserCredentialError",
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

const validateSchema = yup.object({
  password: yup
    .string()
    .required()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "invalid password"
    ),
});

const validatePasswordArgs = async (password: string) => {
  try {
    const validate = await validateSchema.validate({ password });
    return validate;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error;
    }
    throw error;
  }
};

export default DeleteUser;
