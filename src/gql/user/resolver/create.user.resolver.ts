import {
  accessTokenGenerator,
  refreshTokenGenerator,
} from "~/helper/token.helper";

import { ResolveMutation } from "~/types";
import { UserModel } from "~/db/model.db";
import { validateBody } from "~/helper/validator.helper";
import { handleCatchError } from "~/helper/response.helper";
import { setRefreshTokenCookie } from "~/helper/cookie.helper";

const createUser: ResolveMutation<"createUser"> = async (_, args, { res }) => {
  try {
    const bodyData = validateBody(args, 4);

    const newUser = new UserModel(bodyData);
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
