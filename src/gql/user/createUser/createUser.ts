import * as yup from "yup";

import { GQLResolvers } from "~/types/graphqlHelper";
import { MutationCreateUserArgs } from "~/types/graphql";

import { redisClient } from "~/config/redis.config";
import { tokenGenerator } from "~/helper/token.helper";

import { UserModel } from "~/db/model.db";
import { handleCatchError } from "~/helper/response.helper";
import {
  email,
  firstName,
  lastName,
  password,
  validateArgs,
} from "~/helper/validator.helper";

const validateSchema = yup.object({
  email,
  password,
  firstName,
  lastName,
});

const CreateUser: GQLResolvers = {
  Mutation: {
    createUser: async (_parent, args) => {
      try {
        const { argsData, argsError } = await validateArgs(
          validateSchema,
          args
        );

        if (argsError) {
          if (
            argsError.field !== "email" &&
            argsError.field !== "password" &&
            argsError.field !== "firstName" &&
            argsError.field !== "lastName"
          ) {
            throw Error();
          }

          return {
            __typename: "CreateUserArgsError",
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

        const newUser = await UserModel.create({
          ...argsData,
          picture: "default",
        });

        const token = tokenGenerator(newUser._id);
        await redisClient.SADD(newUser._id.toString(), token);

        return {
          __typename: "Token",
          token,
        };
      } catch (error: any) {
        return handleCatchError();
      }
    },
  },
};

export default CreateUser;
