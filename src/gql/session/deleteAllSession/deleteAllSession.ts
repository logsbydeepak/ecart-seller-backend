import * as yup from "yup";
import { UserModel } from "~/db/model.db";
import { redisClient } from "~/config/redis.config";
import { GQLResolvers } from "~/types/graphqlHelper";
import { handleCatchError } from "~/helper/response.helper";
import { validatePassword } from "~/helper/security.helper";
import { TokenUserDoNotExistError } from "~/helper/error.helper";
import { password, validateArgs } from "~/helper/validator.helper";

const validateSchema = yup.object({
  currentPassword: password,
});

const DeleteAllSession: GQLResolvers = {
  Mutation: {
    deleteAllSession: async (
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
          if (argsError.field !== "currentPassword") {
            throw Error();
          }

          return {
            __typename: "DeleteAllSessionArgsError",
            field: argsError.field,
            message: argsError.message,
          };
        }

        const { tokenData, tokenError } = await validateTokenMiddleware(req);
        if (tokenError) return tokenError;
        const { userId, token } = tokenData;

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

        await redisClient.DEL(userId);

        return {
          __typename: "SuccessResponse",
          message: "logout from all device successfully",
        };
      } catch (error) {
        return handleCatchError();
      }
    },
  },
};

export default DeleteAllSession;
