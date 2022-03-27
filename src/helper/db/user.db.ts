import { BuyerAccountModel, SellerAccountModel, UserModel } from "model";
import { UserModelType, UserType } from "types";
import { ErrorObject } from "response";

export const dbEmailExist = async (email: string): Promise<void> => {
  const emailCount = await UserModel.count({ email });
  if (emailCount !== 0) {
    throw ErrorObject("AUTHENTICATION", "user already exist");
  }
};

export const dbUserExist = async (
  userId: string,
  userType: UserType
): Promise<void> => {
  let idCount;

  if (userType === "SELLER") {
    idCount = await SellerAccountModel.count({
      _id: userId,
    });
  } else {
    idCount = await BuyerAccountModel.count({
      _id: userId,
    });
  }

  if (idCount === 0) {
    throw ErrorObject("AUTHENTICATION", "user do not exist");
  }
};

export const dbReadUserById = async (
  userId: string,
  userType: UserType
): Promise<UserModelType> => {
  let dbUser;

  if (userType === "SELLER") {
    dbUser = await SellerAccountModel.findById(userId);
  } else {
    dbUser = await BuyerAccountModel.findById(userId);
  }

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
