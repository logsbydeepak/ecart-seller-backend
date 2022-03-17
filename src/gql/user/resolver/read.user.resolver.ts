import checkAccessToken from "@helper/checkAccessToken";
import { dbReadUserById } from "@helper/db";
import { handleCatchError } from "@response";
import { GQLContext, UserModelType } from "types";
import { QueryResolvers } from "types/graphql";

export const readUser: QueryResolvers<GQLContext>["readUser"] = async (
  _,
  __,
  { req, res }
) => {
  try {
    // @ts-expect-error
    const { id: userId } = await checkAccessToken(req);

    const dbUser: UserModelType = await dbReadUserById(userId);
    return {
      __typename: "User",
      name: dbUser.name,
      email: dbUser.email,
    };
  } catch (error: any) {
    console.log(error);
    return handleCatchError(error);
  }
};
