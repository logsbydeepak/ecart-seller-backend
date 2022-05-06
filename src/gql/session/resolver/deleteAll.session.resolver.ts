import { MutationResolvers } from "types/graphql";

import { removeAccessTokenCookie, removeRefreshTokenCookie } from "helper";

import { TokenModel } from "db";
import { GQLContext } from "types";
import { handleCatchError } from "response";
import { checkAccessToken, checkPassword } from "validateRequest";

export const deleteAllSession: MutationResolvers<GQLContext>["deleteAllSession"] =
  async (parent, args, { req, res }) => {
    try {
      const { userId } = await checkAccessToken(req);
      await checkPassword(args.currentPassword, userId);

      await TokenModel.deleteMany({ owner: userId });

      removeAccessTokenCookie(res);
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
