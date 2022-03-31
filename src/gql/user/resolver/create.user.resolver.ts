import { MutationResolvers } from "types/graphql";

import {
  validateBody,
  dbCreateToken,
  validateUserType,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "helper";

import { GQLContext, UserModelType } from "types";
import { handleCatchError } from "response";
import { BuyerUserModel, SellerUserModel } from "db";

export const createUser: MutationResolvers<GQLContext>["createUser"] = async (
  parent,
  args,
  { req, res }
) => {
  try {
    const bodyData = validateBody(args, 4);
    const userType = validateUserType(args.userType);

    let newUser: UserModelType;
    let newUserId;

    if (userType === "SELLER") {
      newUser = new SellerUserModel(bodyData);
      newUserId = newUser._id;
    } else {
      newUser = new BuyerUserModel(bodyData);
      newUserId = newUser._id;
    }

    const newToken = dbCreateToken(newUserId, 1, userType);

    await newUser.save();
    await newToken.save();

    setAccessTokenCookie(res, newToken.accessToken);
    setRefreshTokenCookie(res, newToken.refreshToken);

    return {
      __typename: "User",
      name: newUser.name,
      email: newUser.email,
      type: userType,
    };
  } catch (error: any) {
    console.log(error);
    return handleCatchError(error);
  }
};
