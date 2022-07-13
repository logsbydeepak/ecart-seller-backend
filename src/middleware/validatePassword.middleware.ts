import {
  GQLResponse,
  GQLResponseType,
  UserModelType,
} from "~/types/graphqlHelper";
import { dbReadUserById } from "~/db/query/user.query";
import { handleCatchError } from "~/helper/response.helper";
import { validatePassword } from "~/helper/validator.helper";
import { validateHashAndSalt } from "~/helper/security.helper";

const validatePasswordMiddleware = async <T extends GQLResponseType>(
  password: string,
  userId: string,
  passwordEmptyErrorObj: GQLResponse<T>,
  passwordInvalidErrorObj: GQLResponse<T>
) => {
  try {
    const currentPassword = validatePassword(
      password,
      passwordEmptyErrorObj,
      passwordInvalidErrorObj
    );

    const dbUser: UserModelType = await dbReadUserById<"TokenError">(userId, {
      __typename: "TokenError",
      type: "TokenUserDoNotExistError",
      message: "user do not exist",
    });

    await validateHashAndSalt(
      currentPassword,
      dbUser.password as string,
      passwordInvalidErrorObj
    );

    return null;
  } catch (error: any) {
    throw handleCatchError(error);
  }
};

export default validatePasswordMiddleware;
