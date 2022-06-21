import { UserModelType } from "~/types";
import { UserModel } from "~/db/model.db";
import { ErrorObject } from "~/helper/response.helper";
import { UserAlreadyExistError } from "~/types/graphql";

export const dbEmailExist = async (email: string) => {
  const emailCount = await UserModel.count({ email });

  if (emailCount !== 0) {
    throw {
      __typename: "UserAlreadyExistError",
      message: "user already exist",
    } as UserAlreadyExistError;
  }
};

export const dbUserExist = async (userId: string): Promise<void> => {
  const idCount = await UserModel.count({
    _id: userId,
  });

  if (idCount === 0) {
    throw ErrorObject("AUTHENTICATION", "user do not exist");
  }
};

export const dbReadUserById = async (
  userId: string
): Promise<UserModelType> => {
  const dbUser = await UserModel.findById(userId);

  if (!dbUser) {
    throw ErrorObject("AUTHENTICATION", "user do not exist");
  }

  return dbUser;
};

export const dbReadUserByEmail = async (email: string) => {
  const dbUser = await UserModel.findOne({ email });

  if (!dbUser) {
    throw ErrorObject("AUTHENTICATION", "user do not exist");
  }

  return dbUser;
};
