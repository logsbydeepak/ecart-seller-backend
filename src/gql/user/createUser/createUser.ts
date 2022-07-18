import * as yup from "yup";

import { GQLResolvers } from "~/types/graphqlHelper";
import { MutationCreateUserArgs } from "~/types/graphql";

import { redisClient } from "~/config/redis.config";
import { tokenGenerator } from "~/helper/token.helper";

import { UserModel } from "~/db/model.db";
import { handleCatchError } from "~/helper/response.helper";

const CreateUser: GQLResolvers = {
  Mutation: {
    createUser: async (_parent, args) => {
      try {
        const validatedArgs = await validateCreateUserArgs(args);

        if (validatedArgs instanceof yup.ValidationError) {
          if (
            validatedArgs.path !== "email" &&
            validatedArgs.path !== "password" &&
            validatedArgs.path !== "firstName" &&
            validatedArgs.path !== "lastName"
          ) {
            throw Error();
          }

          return {
            __typename: "CreateUserCredentialError",
            field: validatedArgs.path,
            message: validatedArgs.message,
          };
        }

        const isEmailExist = await UserModel.exists({ email: args.email });

        if (isEmailExist)
          return {
            __typename: "UserAlreadyExistError",
            message: "email already exist",
          };

        const newUser = await UserModel.create({
          ...validatedArgs,
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

const validateSchema = yup.object({
  email: yup.string().required().email("invalid email").trim().lowercase(),
  password: yup
    .string()
    .required()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "invalid password"
    ),
  firstName: yup.string().required().trim(),
  lastName: yup.string().required().trim(),
});

const validateCreateUserArgs = async (args: MutationCreateUserArgs) => {
  try {
    const validate = await validateSchema.validate(args);
    return validate;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error;
    }
    throw error;
  }
};

export default CreateUser;
