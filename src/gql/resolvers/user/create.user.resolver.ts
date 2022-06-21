import {
  validateEmail,
  validateEmpty,
  validatePassword,
} from "~/helper/validator.helper";

import { GQLResolvers } from "~/types";
import { UserModel } from "~/db/model.db";
import { redisClient } from "~/config/redis.config";
import { tokenGenerator } from "~/helper/token.helper";
import { handleCatchError } from "~/helper/response.helper";

const CreateUser: GQLResolvers = {
  Mutation: {
    createUser: async (_parent, args) => {
      try {
        const firstName = validateEmpty(
          args.firstName,
          "BODY_PARSE",
          "firstName is required"
        );

        const lastName = validateEmpty(
          args.lastName,
          "BODY_PARSE",
          "lastName is required"
        );

        const email = validateEmail(args.email);
        const password = validatePassword(args.password);

        const newUser = new UserModel({ firstName, lastName, email, password });
        const newUserId = newUser._id;
        await newUser.save();

        const token = tokenGenerator(newUserId);
        await redisClient.SADD(newUserId.toString(), token);

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

export default CreateUser;
