import {
  accessTokenGenerator,
  refreshTokenValidator,
} from "~/helper/token.helper";

import { ResolveMutation } from "~/types";
import { validateEmpty } from "~/helper/validator.helper";
import { generateDecryption } from "~/helper/security.helper";
import { removeRefreshTokenCookie } from "~/helper/cookie.helper";
import { ErrorObject, handleCatchError } from "~/helper/response.helper";

const updateSession: ResolveMutation<"updateSession"> = async (
  _,
  __,
  { req, res }
) => {
  try {
    const refreshToken: string = validateEmpty(
      req.cookies.refreshToken,
      "TOKEN_PARSE",
      "access token is required"
    );

    const refreshTokenDecryption: string = generateDecryption(
      refreshToken,
      "TOKEN_PARSE",
      "invalid refresh token"
    );

    const refreshTokenData = refreshTokenValidator(refreshTokenDecryption);

    if (refreshTokenData === null) {
      throw ErrorObject("TOKEN_PARSE", "invalid refresh token");
    }

    if (refreshTokenData === "TokenExpiredError") {
      removeRefreshTokenCookie(res);
      throw ErrorObject("TOKEN_PARSE", "refresh token expired");
    }

    const newAccessToken = accessTokenGenerator(refreshTokenData.id);

    return {
      __typename: "AccessToken",
      token: newAccessToken,
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};

export default updateSession;
