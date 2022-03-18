import { Request } from "express";

import { ErrorObject, handleCatchError } from "@response";
import { validateEmpty } from "@helper/validator";
import { accessTokenValidator } from "@helper/token";
import { generateDecryption } from "@helper/security";
import { dbTokenExist, dbUserExist } from "@helper/db";

const checkAccessToken = async (req: Request) => {
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
      throw ErrorObject("TP", 15);
    }

    if (accessTokenData === "TokenExpiredError") {
      throw ErrorObject("TP", 16);
    }

    const userId: string = accessTokenData.id;
    if (!userId) {
      throw ErrorObject("TP", 15);
    }

    await dbUserExist(userId);

    return userId;
  } catch (error: any) {
    throw handleCatchError(error);
  }
};

export default checkAccessToken;
