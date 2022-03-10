import {
  validateBody,
  validateEmail,
  validateEmpty,
  validatePassword,
} from "@helper/validator";
import { TokenModel, UserModel } from "@model";
import { dbEmailExist } from "helper/db,helper";
import { accessTokenGenerator, refreshTokenGenerator } from "@helper/token";

export const createUser = async (
  _: any,
  args: { name: string; email: string; password: string }
) => {
  try {
    const reqData = validateBody(args, 3);
    const name = validateEmpty(reqData.name, "name is requried");
    const email = validateEmail(reqData.email);
    const password = validatePassword(reqData.password);

    await dbEmailExist(email);

    const newUser = await new UserModel({ name, email, password });
    const accessToken = accessTokenGenerator(newUser._id);
    const refreshToken = refreshTokenGenerator(newUser._id, 3);

    const newToken = await new TokenModel({
      owner: newUser._id,
      refreshToken,
      accessToken,
    });

    await newUser.save();
    await newToken.save();

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
