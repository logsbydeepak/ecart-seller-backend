import { GQLContext } from "~/types";
import { QueryResolvers } from "~/types/graphql";
import { dbReadUserById } from "~/db/query/user.query";
import { handleCatchError } from "~/helper/response.helper";

export const readUser: QueryResolvers<GQLContext>["readUser"] = async (
  parent,
  args,
  { req, res, validateAccessTokenMiddleware }
) => {
  try {
    const { userId } = await validateAccessTokenMiddleware(req);
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
