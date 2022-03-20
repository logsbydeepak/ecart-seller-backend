import { MutationResolvers } from "types/graphql";

import { GQLContext } from "types";

import {
  validateBody,
  dbCreateToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "helper";

import { UserModel } from "model";
import { handleCatchError } from "response";

export const createUser: MutationResolvers<GQLContext>["createUser"] = async (
  parent,
  args,
  { req, res }
) => {
  try {
    const bodyData = validateBody(req.body, 3);
    const newUser = new UserModel(bodyData);
    const newUserId: string = newUser._id;
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
