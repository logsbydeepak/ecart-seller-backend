import { BuyerUserModel, SellerUserModel } from "model";
import { UserModelType, UserType } from "types";
import { ErrorObject } from "response";

export const dbEmailExist = async (
  email: string,
  userType: UserType
): Promise<void> => {
  let emailCount;

  if (userType === "SELLER") {
    emailCount = await SellerUserModel.count({ email });
  } else {
    emailCount = await BuyerUserModel.count({ email });
  }

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
    idCount = await SellerUserModel.count({
      _id: userId,
    });
  } else {
    idCount = await BuyerUserModel.count({
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
    dbUser = await SellerUserModel.findById(userId);
  } else {
    dbUser = await BuyerUserModel.findById(userId);
  }

  if (!dbUser) {
    throw ErrorObject("AUTHENTICATION", "user do not exist");
  }

  return dbUser;
};

export const dbReadUserByEmail = async (
  email: string,
  userType: UserType
): Promise<UserModelType> => {
  let dbUser;

  if (userType === "SELLER") {
    dbUser = await SellerUserModel.findOne({ email });
  } else {
    dbUser = await BuyerUserModel.findOne({ email });
  }

  if (!dbUser) {
    throw ErrorObject("AUTHENTICATION", "user do not exist");
  }

  return dbUser;
};
