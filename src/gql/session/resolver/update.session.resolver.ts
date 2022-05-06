import moment from "moment";
import { GQLContext, TokenModelType } from "types";

import {
  accessTokenGenerator,
  accessTokenValidator,
  refreshTokenValidator,
  removeAccessTokenCookie,
  removeRefreshTokenCookie,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  dbCreateToken,
  dbReadToken,
  dbTokenExist,
  dbUserExist,
  validateEmpty,
  generateDecryption,
  generateEncryption,
} from "helper";

import { TokenModel } from "db";
import { MutationResolvers } from "types/graphql";
import { ErrorObject, handleCatchError } from "response";

export const updateSession: MutationResolvers<GQLContext>["updateSession"] =
  async (parent, args, { req, res }) => {
    try {
      const accessToken: string = validateEmpty(
        req.cookies.accessToken,
        "TOKEN_PARSE",
        "access token is required"
      );

      const refreshToken: string = validateEmpty(
        req.cookies.refreshToken,
        "TOKEN_PARSE",
        "access token is required"
      );

      await dbTokenExist(
        { accessToken },
        "TOKEN_PARSE",
        "invalid access token"
      );
      await dbTokenExist(
        { refreshToken },
        "TOKEN_PARSE",
        "invalid refresh token"
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
        removeAccessTokenCookie(res);
        removeRefreshTokenCookie(res);
        throw ErrorObject("TOKEN_PARSE", "refresh token expired");
      }

      await dbUserExist(refreshTokenData.id);

      const timeBeforeExpire = moment
        .unix(refreshTokenData.exp as number)
        .subtract(1, "day")
        .unix();

      if (
        (refreshTokenData.exp as number) <= timeBeforeExpire &&
        refreshTokenData.refreshTokenRefreshCount < 4
      ) {
        await TokenModel.deleteOne({ accessToken });

        const newDbToken: TokenModelType = dbCreateToken(
          refreshTokenData.id,
          refreshTokenData.refreshTokenRefreshCount + 1
        );
        await newDbToken.save();

        setAccessTokenCookie(res, newDbToken.accessToken);
        setRefreshTokenCookie(res, newDbToken.refreshToken);
        return {
          __typename: "SuccessResponse",
          message: "refresh successfully",
        };
      }

      if (refreshTokenData.refreshTokenRefreshCount >= 4) {
        await TokenModel.deleteOne({ refreshToken });
        removeAccessTokenCookie(res);
        removeRefreshTokenCookie(res);
        throw ErrorObject("TOKEN_PARSE", "refresh token expired");
      }

      if (accessTokenData === "TokenExpiredError") {
        const accessTokenRaw: string = accessTokenGenerator(
          refreshTokenData.id
        );
        const accessTokenEncrypt: string = generateEncryption(accessTokenRaw);

        const dbToken: TokenModelType = await dbReadToken({ accessToken });
        dbToken.accessToken = accessTokenEncrypt;
        await dbToken.save();

        setAccessTokenCookie(res, accessTokenEncrypt);
        return {
          __typename: "SuccessResponse",
          message: "refresh successfully",
        };
      }

      const dbToken: TokenModelType = await dbReadToken({ accessToken });
      await TokenModel.deleteMany({ owner: dbToken.owner });

      removeAccessTokenCookie(res);
      removeRefreshTokenCookie(res);
      throw ErrorObject("TOKEN_PARSE", "cannot update access token");
    } catch (error: any) {
      return handleCatchError(error);
    }
  };
