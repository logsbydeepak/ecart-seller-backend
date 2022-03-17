import {
  removeAccessTokenCookie,
  removeRefreshTokenCookie,
} from "@helper/cookie";

import { TokenModel } from "@model";
import { MutationResolvers } from "types/graphql";
import { GQLContext } from "@types";
import checkAccessToken from "@helper/checkAccessToken";
import checkPassword from "helper/checkPassword.helper";
import { handleCatchError } from "@response";

export const deleteAllSession: MutationResolvers<GQLContext>["deleteAllSession"] =
  async (parent, args, { req, res }) => {
    try {
      // @ts-ignore
      const { id: userId } = await checkAccessToken(req);
      await checkPassword(args.currentPassword, userId);

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
