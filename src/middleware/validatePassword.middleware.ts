import { UserModelType } from "~/types";
import { dbReadUserById } from "~/db/query/user.query";
import { handleCatchError } from "~/helper/response.helper";
import { validatePassword } from "~/helper/validator.helper";
import { validateHashAndSalt } from "~/helper/security.helper";
import { TokenError, TokenErrorType } from "~/types/graphql";

const TokenUserDoNotExistError: TokenError = {
  __typename: "TokenError",
  type: TokenErrorType.TokenUserDoNotExistError,
  message: "user do not exist",
};

const validatePasswordMiddleware = async <T>(
  password: string,
  userId: string,
  passwordEmptyErrorObj: T,
  passwordInvalidErrorObj: T
) => {
  try {
    const currentPassword = validatePassword(
      password,
      passwordEmptyErrorObj,
      passwordInvalidErrorObj
    );

    const dbUser: UserModelType = await dbReadUserById<TokenError>(
      userId,
      TokenUserDoNotExistError
    );
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
