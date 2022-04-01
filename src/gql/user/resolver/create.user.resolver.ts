import { MutationResolvers } from "types/graphql";

import {
  validateBody,
  dbCreateToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "helper";

import { GQLContext, UserModelType } from "types";
import { handleCatchError } from "response";
import { UserModel } from "db";

export const createUser: MutationResolvers<GQLContext>["createUser"] = async (
  parent,
  args,
  { req, res }
) => {
  try {
    const bodyData = validateBody(args, 3);

    const newUser = new UserModel(bodyData);
    const newUserId = newUser._id;

    const newToken = dbCreateToken(newUserId, 1);

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
