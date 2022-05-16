import { GQLContext } from "~/types";
import { MutationResolvers } from "~/types/graphql";
import { dbReadUserById } from "~/db/query/user.query";
import { validateBody, validateEmpty } from "~/helper/validator.helper";
import { ErrorObject, handleCatchError } from "~/helper/response.helper";

const updateUser: MutationResolvers<GQLContext>["updateUser"] = async (
  _,
  args,
  { req, validateAccessTokenMiddleware, validatePasswordMiddleware }
) => {
  try {
    const bodyData = validateBody(args, 3);
    const { userId } = await validateAccessTokenMiddleware(req);
    await validatePasswordMiddleware(args.currentPassword!, userId);

    const toUpdate: string = validateEmpty(
      bodyData.toUpdate,
      "BODY_PARSE",
      "toUpdate is required"
    );

    const dbUser = await dbReadUserById(userId);

    if (
      toUpdate !== "name" &&
      toUpdate !== "email" &&
      toUpdate !== "password"
    ) {
      throw ErrorObject("BODY_PARSE", "invalid toUpdate");
    }

    dbUser[toUpdate] = bodyData[toUpdate];
    await dbUser.save();

    return {
      __typename: "User",
      name: dbUser.name,
      email: dbUser.email,
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};

export default updateUser;
