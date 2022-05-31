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
import { setRefreshTokenCookie } from "~/helper/cookie.helper";

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

    await newUser.save();

    setRefreshTokenCookie(res, refreshToken);

    return {
      __typename: "AccessToken",
      token: accessToken,
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};

export default createUser;
