import { GQLContext } from "~/types";
import { TokenModel } from "~/db/model.db";
import { MutationResolvers } from "~/types/graphql";
import { handleCatchError } from "~/helper/response.helper";
import { removeRefreshTokenCookie } from "~/helper/cookie.helper";

export const deleteAllSession: MutationResolvers<GQLContext>["deleteAllSession"] =
  async (
    _,
    args,
    { req, res, validateAccessTokenMiddleware, validatePasswordMiddleware }
  ) => {
    try {
      const { userId } = await validateAccessTokenMiddleware(req);
      await validatePasswordMiddleware(args.currentPassword, userId);

      await TokenModel.deleteMany({ owner: userId });

      removeRefreshTokenCookie(res);

      res.statusCode = 204;
      return {
        __typename: "SuccessResponse",
        message: "session removed successfully",
      };
    } catch (error: any) {
      return handleCatchError(error);
    }
  };
