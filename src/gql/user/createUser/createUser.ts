import * as yup from "yup";
import { InferType } from "yup";

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
  validateData,
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
        const validatedArgs = await validateData<typeof validateSchema>(
          validateSchema,
          args
        );

        if (validatedArgs.isError) {
          return {
            __typename: "CreateUserArgsError",
            field: validatedArgs.error.path as keyof MutationCreateUserArgs,
            message: validatedArgs.error.message,
          };
        }

        const isEmailExist = await UserModel.exists({
          email: validatedArgs.data.email,
        });

        if (isEmailExist)
          return {
            __typename: "UserAlreadyExistError",
            message: "email already exist",
          };

        const newUser = await UserModel.create({
          ...validatedArgs.data,
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
