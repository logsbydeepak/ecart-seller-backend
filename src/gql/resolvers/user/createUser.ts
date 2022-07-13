import * as yup from "yup";

import { GQLResolvers } from "~/types/graphqlHelper";
import { MutationCreateUserArgs } from "~/types/graphql";

import { UserModel } from "~/db/model.db";
import { dbEmailExist } from "~/db/query/user.query";

import { redisClient } from "~/config/redis.config";
import { tokenGenerator } from "~/helper/token.helper";
import { handleCatchError } from "~/helper/response.helper";

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

const CreateUser: GQLResolvers = {
  Mutation: {
    createUser: async (_parent, args) => {
      try {
        const validatedArgs = await validateCreateUserArgs(args);

        await dbEmailExist<"createUser">(validatedArgs.email, {
          __typename: "UserAlreadyExistError",
          message: "email already exist",
        });

        const newUser = await UserModel.create({
          ...validatedArgs,
          picture: "default",
        });

        const token = tokenGenerator(newUser._id);
        await redisClient.SADD(newUser._id.toString(), token);

        return {
          __typename: "Token",
          token: "hi",
        };
      } catch (error: any) {
        return handleCatchError(error);
      }
    },
  },
};

const validateCreateUserArgs = async (args: MutationCreateUserArgs) => {
  try {
    const validate = await validateSchema.validate(args);
    return validate;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw {
        __typename: "CreateUserCredentialError",
        field: error.path,
        message: error.message,
      };
    }
    throw error;
  }
};

export default CreateUser;
