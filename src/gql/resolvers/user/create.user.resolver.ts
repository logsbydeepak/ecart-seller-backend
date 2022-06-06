import {
  validateBody,
  validateEmail,
  validateEmpty,
  validatePassword,
} from "~/helper/validator.helper";

import { ResolveMutation } from "~/types";
import { tokenGenerator } from "~/helper/token.helper";
import { UserModel } from "~/db/model.db";
import { handleCatchError } from "~/helper/response.helper";
import { redisClient } from "~/config/redis.config";

const createUser: ResolveMutation<"createUser"> = async (_, args, { res }) => {
  try {
    const bodyData = validateBody(args, 4);

    const firstName = validateEmpty(
      bodyData.firstName,
      "BODY_PARSE",
      "firstName is required"
    );

    const lastName = validateEmpty(
      bodyData.lastName,
      "BODY_PARSE",
      "lastName is required"
    );

    const email = validateEmail(bodyData.email);
    const password = validatePassword(bodyData.password);

    const newUser = new UserModel({ firstName, lastName, email, password });
    await newUser.save();

    const newUserId = newUser._id;

    const token = await tokenGenerator(newUserId);

    await redisClient.SADD(newUserId, token);

    return {
      __typename: "Token",
      token,
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};

export default { Mutation: { createUser } };
