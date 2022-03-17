import {
  validateBody,
  validateEmail,
  validatePassword,
} from "@helper/validator";

import { validateHashAndSalt } from "@helper/security";
import { dbCreateToken, dbReadUserByEmail } from "@helper/db";
import {
  CreateUserBodyType,
  GQLContext,
  TokenModelType,
  UserModelType,
} from "@types";
import { setAccessTokenCookie, setRefreshTokenCookie } from "@helper/cookie";
import { MutationResolvers } from "types/graphql";
import { handleCatchError } from "@response";

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
