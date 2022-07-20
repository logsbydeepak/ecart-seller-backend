import { Request } from "express";
import { isValidObjectId } from "mongoose";

import { redisClient } from "~/config/redis.config";
import { TokenError } from "~/types/graphql";

import { tokenValidator } from "~/helper/token.helper";
import { handleCatchError } from "~/helper/response.helper";
import { generateDecryption } from "~/helper/security.helper";

type TokenErrorType = { isError: true; error: TokenError };

const validateTokenMiddleware = async (
  req: Request
): Promise<
  TokenErrorType | { isError: false; userId: string; token: string }
> => {
  try {
    const token = req.headers.token;
    if (!token) return { isError: true, error: TokenRequiredError };
    if (typeof token !== "string")
      return { isError: true, error: TokenInvalidError };

    const tokenDecryption = generateDecryption(token);
    if (!tokenDecryption) return { isError: true, error: TokenInvalidError };

    const tokenData = tokenValidator(tokenDecryption);
    if (!tokenData) return { isError: true, error: TokenInvalidError };
    if (tokenData === "TokenExpiredError")
      return { isError: true, error: TokenExpiredError };

    const userId: string = tokenData.id;
    const userType = tokenData.type;

    if (
      !userId ||
      !isValidObjectId(userId) ||
      !userType ||
      userType !== "SELLER"
    ) {
      return { isError: true, error: TokenInvalidError };
    }

    const isToken = await redisClient.SISMEMBER(userId, token);
    if (!isToken) return { isError: true, error: TokenInvalidError };

    return { isError: false, userId, token };
  } catch (error: any) {
    return handleCatchError();
  }
};

const TokenRequiredError: TokenError = {
  __typename: "TokenError",
  type: "TokenRequiredError",
  message: "token is required",
};

const TokenInvalidError: TokenError = {
  __typename: "TokenError",
  type: "TokenInvalidError",
  message: "invalid token",
};

const TokenExpiredError: TokenError = {
  __typename: "TokenError",
  type: "TokenExpiredError",
  message: "token expired",
};

export default validateTokenMiddleware;
