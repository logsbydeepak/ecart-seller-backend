import { MutationResolvers } from "types/graphql";

import {
  validateBody,
  dbCreateToken,
  validateAccountType,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "helper";

import { GQLContext, UserModelType } from "types";
import { handleCatchError } from "response";
import { BuyerUserModel, SellerUserModel } from "model";

export const createUser: MutationResolvers<GQLContext>["createUser"] = async (
  parent,
  args,
  { req, res }
) => {
  try {
    const bodyData = validateBody(args, 3);
    const accountType = validateAccountType(args.email);

    let newUser: UserModelType;
    let newUserId;

    if (accountType === "SELLER") {
      newUser = new SellerUserModel(bodyData);
      newUserId = newUser._id;
    } else {
      newUser = new BuyerUserModel(bodyData);
      newUserId = newUser._id;
    }

    const newToken = dbCreateToken(newUserId, 1, accountType);

    await newUser.save();
    await newToken.save();

    setAccessTokenCookie(res, newToken.accessToken);
    setRefreshTokenCookie(res, newToken.refreshToken);

    return {
      __typename: "User",
      name: newUser.name,
      email: newUser.email,
      type: accountType,
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};
