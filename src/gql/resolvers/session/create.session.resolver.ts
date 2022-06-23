import { redisClient } from "~/config/redis.config";
import { dbReadUserByEmail } from "~/db/query/user.query";

import { GQLResolvers } from "~/types";
import { Mutation, MutationCreateSessionArgs } from "~/types/graphql";

import { tokenGenerator } from "~/helper/token.helper";
import { handleCatchError } from "~/helper/response.helper";
import { validateHashAndSalt } from "~/helper/security.helper";
import { validateEmail, validatePassword } from "~/helper/validator.helper";

type ResponseType = Mutation["createSession"];

const invalidCredentialError: ResponseType = {
  __typename: "CreateSessionCredentialError",
  message: "invalid email or password",
};

const CreateSession: GQLResolvers = {
  Mutation: {
    createSession: async (_parent, args) => {
      try {
        const { email, password } = validateCreateSessionArgs(args);

        const { _id: dbUserId, password: dbPassword } = await dbReadUserByEmail(
          email
        );

        await validateHashAndSalt<ResponseType>(
          password,
          dbPassword,
          invalidCredentialError
        );

        const token = tokenGenerator(dbUserId);
        await redisClient.SADD(dbUserId.toString(), token);

        return {
          __typename: "Token",
          token,
        };
      } catch (error) {
        return handleCatchError(error);
      }
    },
  },
};

const validateCreateSessionArgs = (args: MutationCreateSessionArgs) => {
  const email = validateEmail<ResponseType>(
    args.email,
    {
      __typename: "CreateSessionCredentialError",
      message: "email is required",
    },
    invalidCredentialError
  );

  const password = validatePassword<ResponseType>(
    args.password,
    {
      __typename: "CreateSessionCredentialError",
      message: "password is required",
    },
    invalidCredentialError
  );

  return { email, password };
};

export default CreateSession;
