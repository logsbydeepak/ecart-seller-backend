import { UserModelType, UserType } from "types";
import { handleCatchError } from "response";
import { dbReadUserById, validatePassword, validateHashAndSalt } from "helper";

export const checkPassword = async (
  password: string,
  userId: string,
  userType: UserType
) => {
  try {
    const currentPassword: string = validatePassword(password);

    const dbUser: UserModelType = await dbReadUserById(userId, userType);
    await validateHashAndSalt(currentPassword, dbUser.password as string);

    return;
  } catch (error: any) {
    return handleCatchError(error);
  }
};
