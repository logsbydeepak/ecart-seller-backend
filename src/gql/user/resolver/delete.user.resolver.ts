import { MutationResolvers } from "types/graphql";

import { removeAccessTokenCookie, removeRefreshTokenCookie } from "helper";

import { GQLContext } from "types";
import { handleCatchError } from "response";
import { checkAccessToken } from "validateRequest";
import { TokenModel, UserModel } from "db";

export const deleteUser: MutationResolvers<GQLContext>["deleteUser"] = async (
  parent,
  args,
  { req, res }
) => {
  try {
    const { userId } = await checkAccessToken(req);

    await UserModel.findByIdAndRemove(userId);
    await TokenModel.findByIdAndRemove(userId);

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
