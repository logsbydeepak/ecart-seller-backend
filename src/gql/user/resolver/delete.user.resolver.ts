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
    // @ts-ignore
    const { id } = await checkAccessToken(req);

    await UserModel.findByIdAndRemove(id);
    await TokenModel.findByIdAndRemove(id);

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
