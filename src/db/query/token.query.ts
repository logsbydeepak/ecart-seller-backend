import { TokenModel, UserModel } from "~/db/model.db";
import { ErrorObject } from "~/helper/response.helper";
import { ErrorMessageTitle, TokenModelType } from "~/types";

export const dbTokenExist = async (
  data: { accessToken: string } | { refreshToken: string },
  messageTitle: ErrorMessageTitle,
  message: string
): Promise<void> => {
  const dbTokenCount = await UserModel.count(data);

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
