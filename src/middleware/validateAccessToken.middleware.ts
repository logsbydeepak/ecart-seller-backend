import { Request } from "express";
import { isValidObjectId } from "mongoose";

import { dbUserExist } from "~/db/query/user.query";
import { dbTokenExist } from "~/db/query/token.query";
import { validateEmpty } from "~/helper/validator.helper";
import { accessTokenValidator } from "~/helper/token.helper";
import { generateDecryption } from "~/helper/security.helper";
import { handleCatchError, ErrorObject } from "~/helper/response.helper";

const validateAccessTokenMiddleware = async (req: Request) => {
  try {
    const accessToken: string = validateEmpty(
      req.headers["x-access-token"],
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
      userType !== "SELLER"
    ) {
      throw ErrorObject("TOKEN_PARSE", "invalid access token");
    }

    await dbTokenExist(
      { owner: userId, token: accessToken },
      "TOKEN_PARSE",
      "invalid access token"
    );
    await dbUserExist(userId);

    return { userId, accessToken };
  } catch (error: any) {
    throw handleCatchError(error);
  }
};

export default validateAccessTokenMiddleware;
