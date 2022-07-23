import { Request } from "express";
import { isValidObjectId } from "mongoose";

import { redisClient } from "~/config/redis.config";
import { TokenError } from "~/types/graphql";

import { tokenValidator } from "~/helper/token.helper";
import { generateDecryption } from "~/helper/security.helper";

const validateTokenMiddleware = async (req: Request) => {
  const token = req.headers.token;
  if (!token) return { tokenData: null, tokenError: TokenRequiredError };
  if (typeof token !== "string")
    return { tokenData: null, tokenError: TokenInvalidError };

  const tokenDecryption = generateDecryption(token);
  if (!tokenDecryption)
    return { tokenData: null, tokenError: TokenInvalidError };

  const tokenData = tokenValidator(tokenDecryption);
  if (!tokenData) return { tokenData: null, tokenError: TokenInvalidError };
  if (tokenData === "TokenExpiredError")
    return { tokenData: null, tokenError: TokenExpiredError };

  const userId: string = tokenData.id;
  const userType = tokenData.type;

  if (
    !userId ||
    !isValidObjectId(userId) ||
    !userType ||
    userType !== "SELLER"
  ) {
    return { tokenData: null, tokenError: TokenInvalidError };
  }

  const isToken = await redisClient.SISMEMBER(userId, token);
  if (!isToken) return { tokenData: null, tokenError: TokenInvalidError };

  return { tokenData: { userId, token }, tokenError: null };
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
