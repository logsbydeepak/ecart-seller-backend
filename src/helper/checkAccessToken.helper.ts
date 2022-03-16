import { NextFunction, Request, Response } from "express";

import { ErrorResponse } from "@response";
import { validateEmpty } from "@helper/validator";
import { accessTokenValidator } from "@helper/token";
import { generateDecryption } from "@helper/security";
import { dbTokenExist, dbUserExist } from "@helper/db";

const checkAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken: string = validateEmpty(
      req.cookies.accessToken,
      "TP",
      14
    );
    const accessTokenDecryption: string = generateDecryption(
      accessToken,
      "TP",
      15
    );

    await dbTokenExist({ accessToken }, "TP", 15);

    const accessTokenData = accessTokenValidator(accessTokenDecryption);

    if (!accessTokenData) {
      return ErrorResponse("TP", 15);
    }

    if (accessTokenData === "TokenExpiredError") {
      return ErrorResponse("TP", 16);
    }

    const userId: string = accessTokenData.id;
    if (!userId) {
      return ErrorResponse("TP", 15);
    }

    await dbUserExist(userId);
    res.locals.userId = userId;

    return next();
  } catch (error: any) {
    return next(error);
  }
};

export default checkAccessToken;
