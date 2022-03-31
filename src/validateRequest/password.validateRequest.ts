import { UserModelType } from "types";
import { handleCatchError } from "response";
import { dbReadUserById, validatePassword, validateHashAndSalt } from "helper";

export const checkPassword = async (password: string, userId: string) => {
  try {
    const currentPassword: string = validatePassword(password);

    const dbUser: UserModelType = await dbReadUserById(userId);
    await validateHashAndSalt(currentPassword, dbUser.password as string);

    return;
  } catch (error: any) {
    return handleCatchError(error);
  }
};
