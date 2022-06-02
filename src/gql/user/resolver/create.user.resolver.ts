import {
  accessTokenGenerator,
  refreshTokenGenerator,
} from "~/helper/token.helper";

import {
  validateBody,
  validateEmail,
  validateEmpty,
  validatePassword,
} from "~/helper/validator.helper";

import { ResolveMutation } from "~/types";
import { UserModel } from "~/db/model.db";
import { handleCatchError } from "~/helper/response.helper";
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "~/helper/cookie.helper";
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

    const accessToken = accessTokenGenerator(newUserId);
    const refreshToken = refreshTokenGenerator(newUserId);

    await redisClient.json.set(newUserId, ".", [
      { refreshToken, accessToken: [accessToken] },
    ]);

    await newUser.save();

    setRefreshTokenCookie(res, refreshToken);
    setAccessTokenCookie(res, accessToken);

    return {
      __typename: "SuccessResponse",
      message: "User created successfully",
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};

export default createUser;
