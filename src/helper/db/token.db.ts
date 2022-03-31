import {
  generateEncryption,
  accessTokenGenerator,
  refreshTokenGenerator,
} from "helper";

import {
  BuyerAccountTokenModel,
  SellerAccountTokenModel,
  TokenModel,
} from "db";
import { ErrorMessageTitle, TokenModelType, UserType } from "types";
import { ErrorObject } from "response";

export const dbCreateToken = (
  userId: string,
  refreshTokenCount: number,
  userType: UserType
): TokenModelType => {
  const accessToken: string = accessTokenGenerator(userId, userType);
  const refreshToken: string = refreshTokenGenerator(
    userId,
    userType,
    refreshTokenCount
  );
  const accessTokenEncrypt: string = generateEncryption(accessToken);
  const refreshTokenEncrypt: string = generateEncryption(refreshToken);

  let newToken: TokenModelType;

  if (userType === "SELLER") {
    newToken = new SellerAccountTokenModel({
      owner: userId,
      refreshToken: refreshTokenEncrypt,
      accessToken: accessTokenEncrypt,
    });
  } else {
    newToken = new BuyerAccountTokenModel({
      owner: userId,
      refreshToken: refreshTokenEncrypt,
      accessToken: accessTokenEncrypt,
    });
  }

  return newToken;
};

export const dbTokenExist = async (
  data: { accessToken: string } | { refreshToken: string },
  userType: UserType,
  messageTitle: ErrorMessageTitle,
  message: string
): Promise<void> => {
  let dbTokenCount;

  if (userType === "SELLER") {
    dbTokenCount = await SellerAccountTokenModel.count(data);
  } else {
    dbTokenCount = await BuyerAccountTokenModel.count(data);
  }

  if (dbTokenCount === 0) {
    throw ErrorObject(messageTitle, message);
  }
};

export const dbReadToken = async (
  data: { accessToken: string } | { refreshToken: string }
): Promise<TokenModelType> => {
  const dbToken: TokenModelType | null = await TokenModel.findOne(data);

  if (!dbToken) {
    throw ErrorObject("TOKEN_PARSE", "invalid token");
  }
  return dbToken;
};
