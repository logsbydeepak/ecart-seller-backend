import { MutationResolvers } from "types/graphql";

import {
  validateEmail,
  validatePassword,
  validateHashAndSalt,
  dbReadUserByEmail,
} from "helper";

import { CreateUserBodyType, GQLContext } from "types";

import { handleCatchError } from "response";
import {
  validateBody,
  setRefreshTokenCookie,
  accessTokenGenerator,
  refreshTokenGenerator,
} from "helper";

export const createSession: MutationResolvers<GQLContext>["createSession"] =
  async (parent, args, { req, res }) => {
    try {
      const bodyData: CreateUserBodyType = validateBody(args, 2);
      const email: string = validateEmail(bodyData.email);
      const password: string = validatePassword(bodyData.password);

      const dbUser = await dbReadUserByEmail(email);

      await validateHashAndSalt(password, dbUser.password as string);
      const dbUserId = dbUser._id;

      const accessToken = accessTokenGenerator(dbUserId);
      const refreshToken = refreshTokenGenerator(dbUserId);

      setRefreshTokenCookie(res, refreshToken);

      return {
        __typename: "User",
        name: dbUser.name,
        email: dbUser.email,
        accessToken,
      };
    } catch (error: any) {
      return handleCatchError(error);
    }
  };
