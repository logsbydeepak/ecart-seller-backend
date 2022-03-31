import { MutationResolvers } from "types/graphql";

import {
  validateBody,
  validateEmail,
  validatePassword,
  validateHashAndSalt,
  dbCreateToken,
  dbReadUserByEmail,
} from "helper";

import {
  CreateUserBodyType,
  GQLContext,
  TokenModelType,
  UserModelType,
} from "types";

import { handleCatchError } from "response";
import { setAccessTokenCookie, setRefreshTokenCookie } from "helper";

export const createSession: MutationResolvers<GQLContext>["createSession"] =
  async (parent, args, { req, res }) => {
    try {
      const bodyData: CreateUserBodyType = validateBody(args, 2);
      const email: string = validateEmail(bodyData.email);
      const password: string = validatePassword(bodyData.password);

      const dbUser: UserModelType = await dbReadUserByEmail(email);

      await validateHashAndSalt(password, dbUser.password as string);
      const dbUserId: string = dbUser._id;
      const newToken: TokenModelType = dbCreateToken(dbUserId, 1);
      await newToken.save();

      setAccessTokenCookie(res, newToken.accessToken);
      setRefreshTokenCookie(res, newToken.refreshToken);

      return {
        __typename: "User",
        name: dbUser.name,
        email: dbUser.email,
      };
    } catch (error: any) {
      return handleCatchError(error);
    }
  };
