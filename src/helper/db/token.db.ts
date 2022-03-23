import {
  generateEncryption,
  accessTokenGenerator,
  refreshTokenGenerator,
} from "helper";

import { TokenModel } from "model";
import { ErrorMessageTitle, TokenModelType } from "types";
import { ErrorObject } from "response";

export const dbCreateToken = (
  userId: string,
  refreshTokenCount: number
): TokenModelType => {
  const accessToken: string = accessTokenGenerator(userId);
  const refreshToken: string = refreshTokenGenerator(userId, refreshTokenCount);
  const accessTokenEncrypt: string = generateEncryption(accessToken);
  const refreshTokenEncrypt: string = generateEncryption(refreshToken);

  const newToken: TokenModelType = new TokenModel({
    owner: userId,
    refreshToken: refreshTokenEncrypt,
    accessToken: accessTokenEncrypt,
  });

  return newToken;
};

export const dbTokenExist = async (
  data: { accessToken: string } | { refreshToken: string },
  messageTitle: ErrorMessageTitle,
  message: string
): Promise<void> => {
  const dbTokenCount: number = await TokenModel.count(data);

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
