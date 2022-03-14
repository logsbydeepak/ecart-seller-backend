import {
  validateBody,
  validateEmail,
  validateEmpty,
  validatePassword,
} from "@helper/validator";
import { UserModel } from "@model";
import { dbCreateToken, dbEmailExist } from "helper/db,helper";
import { MutationResolvers } from "types/graphql";
import { setAccessTokenCookie, setRefreshTokenCookie } from "@helper/cookie";
import { GQLContext } from "types";

export const createUser: MutationResolvers<GQLContext>["createUser"] = async (
  _,
  args,
  { res, user }
) => {
  if (!user.id) {
    console.log(user.error);
  }
  try {
    const reqData = validateBody(args, 3);
    const name = validateEmpty(reqData.name, "name is requried");
    const email = validateEmail(reqData.email);
    const password = validatePassword(reqData.password);

    await dbEmailExist(email);

    const newUser = new UserModel({ name, email, password });
    const newToken = dbCreateToken(newUser._id, 3);

    await newUser.save();
    await newToken.save();

    setAccessTokenCookie(res, newToken.accessToken);
    setRefreshTokenCookie(res, newToken.refreshToken);

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
