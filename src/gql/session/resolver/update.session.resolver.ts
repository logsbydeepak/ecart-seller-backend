import {
  accessTokenGenerator,
  accessTokenValidator,
  refreshTokenValidator,
} from "~/helper/token.helper";

import { ResolveMutation } from "~/types";
import { validateEmpty } from "~/helper/validator.helper";
import { generateDecryption } from "~/helper/security.helper";
import {
  removeRefreshTokenCookie,
  setAccessTokenCookie,
} from "~/helper/cookie.helper";
import { ErrorObject, handleCatchError } from "~/helper/response.helper";
import { redisClient } from "~/config/redis.config";

const updateSession: ResolveMutation<"updateSession"> = async (
  _,
  __,
  { req, res }
) => {
  try {
    const refreshToken: string = validateEmpty(
      req.cookies.refreshToken,
      "TOKEN_PARSE",
      "refresh token is required"
    );

    const accessToken: string = validateEmpty(
      req.cookies.refreshToken,
      "TOKEN_PARSE",
      "access token is required"
    );

    const refreshTokenDecryption: string = generateDecryption(
      refreshToken,
      "TOKEN_PARSE",
      "invalid refresh token"
    );

    const accessTokenDecryption: string = generateDecryption(
      accessToken,
      "TOKEN_PARSE",
      "invalid access token"
    );

    const refreshTokenData = refreshTokenValidator(refreshTokenDecryption);
    const accessTokenData = accessTokenValidator(accessTokenDecryption);

    if (refreshTokenData === null) {
      throw ErrorObject("TOKEN_PARSE", "invalid refresh token");
    }

    if (accessTokenData === null) {
      throw ErrorObject("TOKEN_PARSE", "invalid access token");
    }

    if (refreshTokenData === "TokenExpiredError") {
      removeRefreshTokenCookie(res);
      throw ErrorObject("TOKEN_PARSE", "invalid refresh token");
    }

    const getToken = await redisClient.hGet(refreshTokenData.id, accessToken);

    if (!getToken) {
      throw ErrorObject("TOKEN_PARSE", "invalid access token");
    }

    if (getToken !== refreshToken) {
      throw ErrorObject("TOKEN_PARSE", "invalid access token");
    }

    const newAccessToken = accessTokenGenerator(refreshTokenData.id);

    await redisClient.hSet(refreshTokenData.id, newAccessToken, refreshToken);

    setAccessTokenCookie(res, newAccessToken);

    return {
      __typename: "SuccessResponse",
      message: "Token updated",
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};

export default updateSession;
