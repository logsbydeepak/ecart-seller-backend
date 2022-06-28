import { Request } from "express";
import { isValidObjectId } from "mongoose";

import { redisClient } from "~/config/redis.config";
import { TokenError } from "~/types/graphql";

import { tokenValidator } from "~/helper/token.helper";
import { validateEmpty } from "~/helper/validator.helper";
import { handleCatchError } from "~/helper/response.helper";
import { generateDecryption } from "~/helper/security.helper";

const validateTokenMiddleware = async (req: Request) => {
  try {
    const token: string = validateEmpty<"TokenError">(
      req.headers.token,
      TokenRequiredError
    );

    const tokenDecryption = generateDecryption<"TokenError">(
      token,
      TokenInvalidError
    );

    const tokenData = tokenValidator(tokenDecryption);

    if (!tokenData) {
      throw TokenInvalidError;
    }

    if (tokenData === "TokenExpiredError") {
      throw TokenExpiredError;
    }

    const userId: string = tokenData.id;
    const userType = tokenData.type;

    if (
      !userId ||
      !isValidObjectId(userId) ||
      !userType ||
      userType !== "SELLER"
    ) {
      throw TokenInvalidError;
    }

    const isToken = await redisClient.SISMEMBER(userId, token);

    if (!isToken) {
      throw TokenInvalidError;
    }

    return { userId, token };
  } catch (error: any) {
    throw handleCatchError(error);
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
