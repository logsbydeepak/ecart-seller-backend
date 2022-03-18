import checkAccessToken from "@helper/checkAccessToken";
import { dbReadUserById } from "@helper/db";
import { handleCatchError } from "@response";
import { __TypeKind } from "graphql";
import { GQLContext, UserModelType } from "types";
import { QueryResolvers } from "types/graphql";

export const readUser: QueryResolvers<GQLContext>["readUser"] = async (
  parent,
  args,
  { req, res }
) => {
  try {
    const userId = await checkAccessToken(req);
    const dbUser: UserModelType = await dbReadUserById(userId);
    return {
      __typename: "User",
      name: dbUser.name,
      email: dbUser.email,
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};
