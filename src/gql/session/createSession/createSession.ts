import * as yup from "yup";
import { UserModel } from "~/db/model.db";
import { redisClient } from "~/config/redis.config";
import { GQLResolvers } from "~/types/graphqlHelper";
import { InvalidCredentialError } from "~/types/graphql";
import { tokenGenerator } from "~/helper/token.helper";
import { handleCatchError } from "~/helper/response.helper";
import { validatePassword } from "~/helper/security.helper";
import { email, password, validateArgs } from "~/helper/validator.helper";

const InvalidCredentialError: InvalidCredentialError = {
  __typename: "InvalidCredentialError",
  message: "invalid credential",
};

const validateSchema = yup.object({
  email,
  password,
});

const CreateSession: GQLResolvers = {
  Mutation: {
    createSession: async (_parent, args) => {
      try {
        const { argsData, argsError } = await validateArgs(
          validateSchema,
          args
        );

        if (argsError) {
          if (argsError.field !== "email" && argsError.field !== "password") {
            throw Error();
          }

          return {
            __typename: "CreateSessionArgsError",
            field: argsError.field,
            message: argsError.message,
          };
        }

        const dbUser = await UserModel.findOne({
          email: argsData.email,
        });

        if (!dbUser) return InvalidCredentialError;

        const isValidPassword = validatePassword({
          rawPassword: argsData.password,
          dbPassword: dbUser.password,
        });

        if (!isValidPassword) return InvalidCredentialError;

        const token = tokenGenerator(dbUser._id);
        await redisClient.SADD(dbUser._id.toString(), token);

        return {
          __typename: "Token",
          token,
        };
      } catch (error) {
        return handleCatchError();
      }
    },
  },
};

export default CreateSession;
