import { MutationResolvers } from "types/graphql";

import {
  validateBody,
  setRefreshTokenCookie,
  accessTokenGenerator,
  refreshTokenGenerator,
} from "helper";

import { UserModel } from "db";
import { GQLContext } from "types";
import { handleCatchError } from "response";

export const createUser: MutationResolvers<GQLContext>["createUser"] = async (
  _,
  args,
  { res }
) => {
  try {
    const bodyData = validateBody(args, 3);

    const newUser = new UserModel(bodyData);
    const newUserId = newUser._id;

    const accessToken = accessTokenGenerator(newUserId);
    const refreshToken = refreshTokenGenerator(newUserId);

    await newUser.save();

    setRefreshTokenCookie(res, refreshToken);
    res.setHeader("x-access-token", accessToken);

    return {
      __typename: "UserAccessToken",
      name: newUser.name,
      email: newUser.email,
      accessToken,
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};
