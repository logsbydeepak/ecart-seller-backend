import {
  validateBody,
  validateEmail,
  validatePassword,
} from "~/helper/validator.helper";

import { redisClient } from "~/config/redis.config";
import { tokenGenerator } from "~/helper/token.helper";
import { dbReadUserByEmail } from "~/db/query/user.query";
import { handleCatchError } from "~/helper/response.helper";
import { CreateUserBodyType, ResolveMutation } from "~/types";
import { validateHashAndSalt } from "~/helper/security.helper";

const createSession: ResolveMutation<"createSession"> = async (
  _,
  args,
  { res }
) => {
  try {
    const bodyData: CreateUserBodyType = validateBody(args, 2);
    const email: string = validateEmail(bodyData.email);
    const password: string = validatePassword(bodyData.password);

    const dbUser = await dbReadUserByEmail(email);
    const dbUserId = dbUser._id;

    await validateHashAndSalt(password, dbUser.password as string);

    const token = tokenGenerator(dbUserId);
    await redisClient.SADD(dbUserId, token);

    return {
      __typename: "Token",
      token,
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};

export default { Mutation: { createSession } };
