import { UserModelType } from "~/types";
import { dbReadUserById } from "~/db/query/user.query";
import { handleCatchError } from "~/helper/response.helper";
import { validatePassword } from "~/helper/validator.helper";
import { validateHashAndSalt } from "~/helper/security.helper";

const validatePasswordMiddleware = async (password: string, userId: string) => {
  try {
    const currentPassword: string = validatePassword(password);

    const dbUser: UserModelType = await dbReadUserById(userId);
    await validateHashAndSalt(currentPassword, dbUser.password as string);

    return null;
  } catch (error: any) {
    throw handleCatchError(error);
  }
};

export default validatePasswordMiddleware;
