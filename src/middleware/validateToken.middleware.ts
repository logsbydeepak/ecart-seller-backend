import { Request } from "express";
import { isValidObjectId } from "mongoose";

import { redisClient } from "~/config/redis.config";
import { tokenValidator } from "~/helper/token.helper";
import { validateEmpty } from "~/helper/validator.helper";
import { generateDecryption } from "~/helper/security.helper";
import { handleCatchError, ErrorObject } from "~/helper/response.helper";

const validateTokenMiddleware = async (req: Request) => {
  try {
    const token: string = validateEmpty(
      req.headers.token,
      "TOKEN_PARSE",
      "access token is required"
    );

    const tokenDecryption: string = generateDecryption(
      token,
      "TOKEN_PARSE",
      "invalid access token"
    );

    const tokenData = tokenValidator(tokenDecryption);

    if (!tokenData) {
      throw ErrorObject("TOKEN_PARSE", "invalid access token");
    }

    if (tokenData === "TokenExpiredError") {
      throw ErrorObject("TOKEN_PARSE", "token expired");
    }

    const userId: string = tokenData.id;
    const userType = tokenData.type;

    if (
      !userId ||
      !isValidObjectId(userId) ||
      !userType ||
      userType !== "SELLER"
    ) {
      throw ErrorObject("TOKEN_PARSE", "invalid access token");
    }

    const isToken = await redisClient.SISMEMBER(userId, token);

    if (!isToken) {
      throw ErrorObject("TOKEN_PARSE", "invalid access token");
    }

    return { userId, token };
  } catch (error: any) {
    throw handleCatchError(error);
  }
};

export default validateTokenMiddleware;
