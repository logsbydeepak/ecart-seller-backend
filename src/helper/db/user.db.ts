import { UserModel } from "model";
import { UserModelType } from "types";
import { ErrorObject } from "response";

export const dbEmailExist = async (email: string): Promise<void> => {
  const emailCount = await UserModel.count({ email });
  if (emailCount !== 0) {
    throw ErrorObject("AUTHENTICATION", "user already exist");
  }
};

export const dbUserExist = async (userId: string): Promise<void> => {
  const idCount: number = await UserModel.count({
    _id: userId,
  });

  if (idCount === 0) {
    throw ErrorObject("AUTHENTICATION", "user do not exist");
  }
};

export const dbReadUserById = async (
  userId: string
): Promise<UserModelType> => {
  const dbUser: UserModelType | null = await UserModel.findById(userId);

  if (!dbUser) {
    throw ErrorObject("AUTHENTICATION", "user do not exist");
  }

  return dbUser;
};

export const dbReadUserByEmail = async (
  email: string
): Promise<UserModelType> => {
  const dbUser: UserModelType | null = await UserModel.findOne({ email });

  if (!dbUser) {
    throw ErrorObject("AUTHENTICATION", "user do not exist");
  }

  return dbUser;
};
