import { TokenModel, UserModel } from "~/db/model.db";
import { removeRefreshTokenCookie } from "~/helper/cookie.helper";
import { handleCatchError } from "~/helper/response.helper";
import { GQLContext } from "~/types";
import { MutationResolvers } from "~/types/graphql";

export const deleteUser: MutationResolvers<GQLContext>["deleteUser"] = async (
  parent,
  args,
  { req, res, validateAccessTokenMiddleware }
) => {
  try {
    const { userId } = await validateAccessTokenMiddleware(req);

    await UserModel.findByIdAndRemove(userId);
    await TokenModel.findByIdAndRemove(userId);

    removeRefreshTokenCookie(res);

    return {
      __typename: "SuccessResponse",
      message: "user removed successfully",
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};
