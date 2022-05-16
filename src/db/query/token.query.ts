import { InvalidTokenModel, UserModel } from "~/db/model.db";
import { ErrorObject } from "~/helper/response.helper";
import { ErrorMessageTitle, TokenModelType } from "~/types";

export const dbTokenExist = async (
  data: { owner: string; token: string },
  messageTitle: ErrorMessageTitle,
  message: string
): Promise<void> => {
  const dbTokenCount = await InvalidTokenModel.count(data);

  if (dbTokenCount === 1) {
    throw ErrorObject(messageTitle, message);
  }
};
