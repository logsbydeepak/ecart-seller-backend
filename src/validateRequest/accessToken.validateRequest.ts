import { Request } from "express";

import { handleCatchError, ErrorObject } from "response";
import { isValidObjectId } from "mongoose";
import {
  validateEmpty,
  accessTokenValidator,
  generateDecryption,
  dbTokenExist,
  dbUserExist,
} from "helper";

export const checkAccessToken = async (req: Request) => {
  try {
    const accessToken: string = validateEmpty(
      req.cookies.accessToken,
      "TOKEN_PARSE",
      "access token is required"
    );

    const accessTokenDecryption: string = generateDecryption(
      accessToken,
      "TOKEN_PARSE",
      "invalid access token"
    );

    const accessTokenData = accessTokenValidator(accessTokenDecryption);

    if (!accessTokenData) {
      throw ErrorObject("TOKEN_PARSE", "invalid access token");
    }

    if (accessTokenData === "TokenExpiredError") {
      throw ErrorObject("TOKEN_PARSE", "token expired");
    }

    const userId: string = accessTokenData.id;
    const userType = accessTokenData.type;

    if (
      !userId ||
      !isValidObjectId(userId) ||
      !userType ||
      (userType !== "SELLER" && userType !== "BUYER")
    ) {
      throw ErrorObject("TOKEN_PARSE", "invalid access token");
    }

    await dbTokenExist(
      { accessToken },
      userType,
      "TOKEN_PARSE",
      "invalid access token"
    );
    await dbUserExist(userId, userType);

    return { userId, userType };
  } catch (error: any) {
    throw handleCatchError(error);
  }
};
