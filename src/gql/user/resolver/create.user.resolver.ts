import { MutationResolvers } from "types/graphql";

import {
  CreateUserBodyType,
  GQLContext,
  TokenModelType,
  UserModelType,
} from "types";

import {
  validateBody,
  validateEmail,
  validateEmpty,
  validatePassword,
  dbCreateToken,
  dbEmailExist,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "helper";

import { UserModel } from "model";
import { handleCatchError } from "response";

export const createUser: MutationResolvers<GQLContext>["createUser"] = async (
  _,
  args,
  { req, res }
) => {
  try {
    const bodyData: CreateUserBodyType = validateBody(args, 3);
    const name: string = validateEmpty(bodyData.name, "BP", 13);
    const email: string = validateEmail(bodyData.email);
    const password: string = validatePassword(bodyData.password);

    await dbEmailExist(email);

    const newUser: UserModelType = new UserModel({ name, email, password });
    const newUserId: string = newUser._id;
    const newToken: TokenModelType = dbCreateToken(newUserId, 1);

    await newUser.save();
    await newToken.save();

    setAccessTokenCookie(res, newToken.accessToken);
    setRefreshTokenCookie(res, newToken.refreshToken);

    return {
      __typename: "User",
      name: newUser.name,
      email: newUser.email,
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};
