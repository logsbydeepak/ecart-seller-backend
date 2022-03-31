import { NextFunction, Request, Response } from "express";

import { removeAccessTokenCookie, removeRefreshTokenCookie } from "helper";

import { TokenModel } from "db";
import { MutationResolvers } from "types/graphql";
import { GQLContext } from "types";
import { handleCatchError } from "response";
import { checkAccessToken } from "validateRequest";

export const deleteSession: MutationResolvers<GQLContext>["deleteSession"] =
  async (parent, args, { req, res }) => {
    try {
      await checkAccessToken(req);
      const { accessToken } = req.cookies;

      await TokenModel.deleteOne({ accessToken });

      removeAccessTokenCookie(res);
      removeRefreshTokenCookie(res);

      return {
        __typename: "SuccessResponse",
        message: "session removed successfully",
      };
    } catch (error: any) {
      return handleCatchError(error);
    }
  };
