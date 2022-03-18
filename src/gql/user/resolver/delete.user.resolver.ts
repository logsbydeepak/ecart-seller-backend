import checkAccessToken from "@helper/checkAccessToken";
import {
  removeAccessTokenCookie,
  removeRefreshTokenCookie,
} from "@helper/cookie";

import { TokenModel, UserModel } from "@model";
import { handleCatchError } from "@response";
import { GQLContext } from "@types";
import { MutationResolvers } from "types/graphql";

export const deleteUser: MutationResolvers<GQLContext>["deleteUser"] = async (
  parend,
  args,
  { req, res }
) => {
  try {
    const userId = await checkAccessToken(req);

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
