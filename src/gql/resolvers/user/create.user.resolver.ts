import {
  validateEmail,
  validateEmpty,
  validatePassword,
} from "~/helper/validator.helper";

import { tokenGenerator } from "~/helper/token.helper";
import { handleCatchError } from "~/helper/response.helper";

import {
  Mutation,
  CreateUserCredentialFiled,
  MutationCreateUserArgs,
} from "~/types/graphql";

import { GQLResolvers } from "~/types";

import { UserModel } from "~/db/model.db";
import { dbEmailExist } from "~/db/query/user.query";

import { redisClient } from "~/config/redis.config";

type ResponseType = Mutation["createUser"];

const CreateUser: GQLResolvers = {
  Mutation: {
    createUser: async (_parent, args) => {
      try {
        const validatedArgs = validateCreateUserArgs(args);
        await dbEmailExist(validatedArgs.email);

        const newUser = await new UserModel(validatedArgs).save();

        const token = tokenGenerator(newUser._id);
        await redisClient.SADD(newUser._id.toString(), token);

        return {
          __typename: "Token",
          token,
        };
      } catch (error: any) {
        return handleCatchError(error);
      }
    },
  },
};

const validateCreateUserArgs = (args: MutationCreateUserArgs) => {
  const firstName = validateEmpty<ResponseType>(args.firstName, {
    __typename: "CreateUserCredentialError",
    field: "firstName",
    message: "firstName is required",
  });

  const lastName = validateEmpty<ResponseType>(args.firstName, {
    __typename: "CreateUserCredentialError",
    field: "lastName",
    message: "lastName is required",
  });

  const email = validateEmail<ResponseType>(
    args.email,
    {
      __typename: "CreateUserCredentialError",
      field: "email",
      message: "email is required",
    },
    {
      __typename: "CreateUserCredentialError",
      field: "email",
      message: "invalid email",
    }
  );

  const password = validatePassword<ResponseType>(
    args.password,
    {
      __typename: "CreateUserCredentialError",
      field: "password",
      message: "password is required",
    },
    {
      __typename: "CreateUserCredentialError",
      field: "password",
      message: "invalid password",
    }
  );

  return { firstName, lastName, email, password };
};

export default CreateUser;
