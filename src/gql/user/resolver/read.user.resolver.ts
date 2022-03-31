import { dbReadUserById } from "helper";
import { handleCatchError } from "response";
import { QueryResolvers } from "types/graphql";
import { GQLContext } from "types";
import { checkAccessToken } from "validateRequest";

export const readUser: QueryResolvers<GQLContext>["readUser"] = async (
  parent,
  args,
  { req, res }
) => {
  try {
    const { userId } = await checkAccessToken(req);
    const dbUser = await dbReadUserById(userId);

    return {
      __typename: "User",
      name: dbUser.name,
      email: dbUser.email,
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};
