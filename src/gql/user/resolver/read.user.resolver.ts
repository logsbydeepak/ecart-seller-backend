import { dbReadUserById } from "helper";
import { handleCatchError } from "response";
import { QueryResolvers } from "types/graphql";
import { GQLContext, UserModelType } from "types";
import { checkAccessToken } from "validateRequest";
import { SellerAccountModel } from "model";

export const readUser: QueryResolvers<GQLContext>["readUser"] = async (
  parent,
  args,
  { req, res }
) => {
  try {
    const { userId, userType } = await checkAccessToken(req);
    const dbUser: UserModelType = await dbReadUserById(userId, userType);

    return {
      __typename: "User",
      name: dbUser.name,
      email: dbUser.email,
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};
