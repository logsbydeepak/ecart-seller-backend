import { GQLContext } from "types";

import {
  accessTokenGenerator,
  accessTokenValidator,
  refreshTokenValidator,
  removeRefreshTokenCookie,
  validateEmpty,
  generateDecryption,
} from "helper";

import { MutationResolvers } from "types/graphql";
import { ErrorObject, handleCatchError } from "response";

export const updateSession: MutationResolvers<GQLContext>["updateSession"] =
  async (_, __, { req, res }) => {
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

      const newAccessToken = accessTokenGenerator(refreshTokenData.id);

      return {
        __typename: "Token",
        accessToken: newAccessToken,
      };
    } catch (error: any) {
      return handleCatchError(error);
    }
  };
