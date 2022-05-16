import { ResolveQuery } from "~/types";
import { dbReadUserById } from "~/db/query/user.query";
import { handleCatchError } from "~/helper/response.helper";

const readUser: ResolveQuery<"readUser"> = async (
  _,
  __,
  { req, validateAccessTokenMiddleware }
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

export default readUser;
