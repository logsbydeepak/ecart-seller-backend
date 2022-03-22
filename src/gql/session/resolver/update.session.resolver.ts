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

import { TokenModel } from "model";
import { MutationResolvers } from "types/graphql";
import { ErrorObject, handleCatchError } from "response";

export const updateSession: MutationResolvers<GQLContext>["updateSession"] =
  async (parent, args, { req, res }) => {
    try {
      const accessToken: string = validateEmpty(
        req.cookies.accessToken,
        "TP",
        14
      );
      const refreshToken: string = validateEmpty(
        req.cookies.refreshToken,
        "TP",
        14
      );
      await dbTokenExist({ accessToken }, "TP", 15);
      await dbTokenExist({ refreshToken }, "TP", 11);

      const accessTokenDecryption: string = generateDecryption(
        accessToken,
        "TP",
        15
      );

      const refreshTokenDecryption: string = generateDecryption(
        refreshToken,
        "TP",
        11
      );

      const accessTokenData = accessTokenValidator(accessTokenDecryption);
      const refreshTokenData = refreshTokenValidator(refreshTokenDecryption);

      if (accessTokenData === null) {
        throw ErrorObject("TP", 15);
      }

      if (refreshTokenData === null) {
        throw ErrorObject("TP", 11);
      }

      if (accessTokenData !== "TokenExpiredError") {
        throw ErrorObject("TP", 12);
      }

      if (refreshTokenData === "TokenExpiredError") {
        removeAccessTokenCookie(res);
        removeRefreshTokenCookie(res);
        throw ErrorObject("TP", 13);
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
        res.send();
        return {
          __typename: "SuccessResponse",
          message: "refresh successfully",
        };
      }

      if (refreshTokenData.refreshTokenRefreshCount >= 4) {
        await TokenModel.deleteOne({ refreshToken });
        removeAccessTokenCookie(res);
        removeRefreshTokenCookie(res);
        throw ErrorObject("TP", 17);
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
        res.send();
        return {
          __typename: "SuccessResponse",
          message: "refresh successfully",
        };
      }

      const dbToken: TokenModelType = await dbReadToken({ accessToken });
      await TokenModel.deleteMany({ owner: dbToken.owner });

      removeAccessTokenCookie(res);
      removeRefreshTokenCookie(res);
      throw ErrorObject("TP", 18);
    } catch (error: any) {
      return handleCatchError(error);
    }
  };