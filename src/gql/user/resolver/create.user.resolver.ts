import {
  validateBody,
  validateEmail,
  validateEmpty,
  validatePassword,
} from "@helper/validator";
import { UserModel } from "@model";

export const createUser = async (
  _: any,
  args: { name: string; email: string; password: string }
) => {
  try {
    const reqData = validateBody(args, 3);
    const name = validateEmpty(reqData.name, "name is requried");
    const email = validateEmail(reqData.email);
    const password = validatePassword(reqData.password);

    const newUser = await new UserModel(args);
    newUser.save();
    return {
      __typename: "User",
      name: newUser.name,
      email: args.email,
    };
  } catch (error: any) {
    if (error.__typename === "ErrorResponse") {
      return error;
    }

    return {
      __typename: "ErrorResponse",
      title: "INTERNAL_SERVER",
      message: "Something went wrong",
    };
  }
};
