import { TokenModel, UserModel } from "@model";
import { generateEncryption } from "@helper/security";
import { accessTokenGenerator, refreshTokenGenerator } from "@helper/token";

export const dbEmailExist = async (email: string): Promise<void> => {
  const emailCount = await UserModel.count({ email });
  if (emailCount !== 0) {
    throw {
      __typename: "ErrorResponse",
      title: "AUTHENTICATION",
      message: "email already exists",
    };
  }
};

export const dbCreateToken = (userId: string, refreshTokenCount: number) => {
  const accessToken: string = accessTokenGenerator(userId);
  const refreshToken: string = refreshTokenGenerator(userId, refreshTokenCount);
  const accessTokenEncrypt: string = generateEncryption(accessToken);
  const refreshTokenEncrypt: string = generateEncryption(refreshToken);

  const newToken = new TokenModel({
    owner: userId,
    refreshToken: refreshTokenEncrypt,
    accessToken: accessTokenEncrypt,
  });

  return newToken;
};
