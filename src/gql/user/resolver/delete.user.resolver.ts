import { MutationResolvers } from "types/graphql";

import { removeAccessTokenCookie, removeRefreshTokenCookie } from "helper";

import { GQLContext } from "types";
import { handleCatchError } from "response";
import {
  BuyerUserModel,
  BuyerAccountTokenModel,
  SellerUserModel,
  SellerAccountTokenModel,
} from "model";
import { checkAccessToken } from "validateRequest";

export const deleteUser: MutationResolvers<GQLContext>["deleteUser"] = async (
  parent,
  args,
  { req, res }
) => {
  try {
    const { userId, userType } = await checkAccessToken(req);

    if (userType === "SELLER") {
      await SellerUserModel.findByIdAndRemove(userId);
      await SellerAccountTokenModel.findByIdAndRemove(userId);
    } else {
      await BuyerUserModel.findByIdAndRemove(userId);
      await BuyerAccountTokenModel.findByIdAndRemove(userId);
    }

    removeAccessTokenCookie(res);
    removeRefreshTokenCookie(res);

    return {
      __typename: "SuccessResponse",
      message: "user removed successfully",
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};
