import { UserModelType } from "@types";
import { dbReadUserById } from "@helper/db";
import { validatePassword } from "@helper/validator";
import { validateHashAndSalt } from "@helper/security";
import { handleCatchError } from "@response";

const checkPassword = async (password: string, userId: string) => {
  try {
    const currentPassword: string = validatePassword(password);

    const dbUser: UserModelType = await dbReadUserById(userId);
    await validateHashAndSalt(currentPassword, dbUser.password as string);

    return;
  } catch (error: any) {
    return handleCatchError(error);
  }
};

export default checkPassword;
