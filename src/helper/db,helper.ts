import { UserModel } from "@model";

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
