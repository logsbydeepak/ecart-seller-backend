import { ResolveQuery } from "~/types";
import { dbReadUserById } from "~/db/query/user.query";
import { handleCatchError } from "~/helper/response.helper";

const readUser: ResolveQuery<"readUser"> = async (
  _,
  __,
  { req, validateTokenMiddleware }
) => {
  try {
    const { userId } = await validateTokenMiddleware(req);
    const dbUser = await dbReadUserById(userId);

    return {
      __typename: "User",
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      email: dbUser.email,
      picture: "default",
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};

export default { Query: { readUser } };
