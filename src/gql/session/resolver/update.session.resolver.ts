import {
  accessTokenGenerator,
  accessTokenValidator,
  refreshTokenValidator,
} from "~/helper/token.helper";

import { ResolveMutation } from "~/types";
import { dbTokenExist } from "~/db/query/token.query";
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
    const accessToken: string = validateEmpty(
      req.headers["x-access-token"],
      "TOKEN_PARSE",
      "access token is required"
    );

    const refreshToken: string = validateEmpty(
      req.cookies.refreshToken,
      "TOKEN_PARSE",
      "access token is required"
    );

    const accessTokenDecryption: string = generateDecryption(
      accessToken,
      "TOKEN_PARSE",
      "invalid access token"
    );

    const refreshTokenDecryption: string = generateDecryption(
      refreshToken,
      "TOKEN_PARSE",
      "invalid refresh token"
    );

    const accessTokenData = accessTokenValidator(accessTokenDecryption);
    const refreshTokenData = refreshTokenValidator(refreshTokenDecryption);

    if (accessTokenData === null) {
      throw ErrorObject("TOKEN_PARSE", "invalid access token");
    }

    if (refreshTokenData === null) {
      throw ErrorObject("TOKEN_PARSE", "invalid refresh token");
    }

    if (accessTokenData !== "TokenExpiredError") {
      throw ErrorObject("TOKEN_PARSE", "access token is not expired");
    }

    if (refreshTokenData === "TokenExpiredError") {
      removeRefreshTokenCookie(res);
      throw ErrorObject("TOKEN_PARSE", "refresh token expired");
    }

    await dbTokenExist(
      { owner: refreshTokenData.id, token: accessToken },
      "TOKEN_PARSE",
      "invalid access token"
    );

    const newAccessToken = accessTokenGenerator(refreshTokenData.id);

    return {
      __typename: "Token",
      accessToken: newAccessToken,
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};

export default updateSession;
