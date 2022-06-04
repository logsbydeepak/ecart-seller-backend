import {
  accessTokenGenerator,
  refreshTokenGenerator,
} from "~/helper/token.helper";

import {
  validateBody,
  validateEmail,
  validatePassword,
} from "~/helper/validator.helper";

import { dbReadUserByEmail } from "~/db/query/user.query";
import { handleCatchError } from "~/helper/response.helper";
import { CreateUserBodyType, ResolveMutation } from "~/types";
import { validateHashAndSalt } from "~/helper/security.helper";
import { setRefreshTokenCookie } from "~/helper/cookie.helper";

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

    await validateHashAndSalt(password, dbUser.password as string);
    const dbUserId = dbUser._id;

    const accessToken = accessTokenGenerator(dbUserId);
    const refreshToken = refreshTokenGenerator(dbUserId);

    setRefreshTokenCookie(res, refreshToken);
    res.setHeader("x-access-token", accessToken);

    return {
      __typename: "User",
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      email: dbUser.email,
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};

export default { Mutation: { createSession } };
