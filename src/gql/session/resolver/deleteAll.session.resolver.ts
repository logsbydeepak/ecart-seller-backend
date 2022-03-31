import { MutationResolvers } from "types/graphql";

import { removeAccessTokenCookie, removeRefreshTokenCookie } from "helper";

import { TokenModel } from "db";
import { GQLContext } from "types";
import { handleCatchError } from "response";
import { checkAccessToken, checkPassword } from "validateRequest";

export const deleteAllSession: MutationResolvers<GQLContext>["deleteAllSession"] =
  async (parent, args, { req, res }) => {
    try {
      const { userId, userType } = await checkAccessToken(req);
      await checkPassword(args.currentPassword, userId, userType);

      await TokenModel.deleteMany({ owner: userId });

      removeAccessTokenCookie(res);
      removeRefreshTokenCookie(res);

      res.statusCode = 204;
      res.send();
      return {
        __typename: "SuccessResponse",
        message: "session removed successfully",
      };
    } catch (error: any) {
      return handleCatchError(error);
    }
  };
