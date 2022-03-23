import { MutationResolvers } from "types/graphql";

import { validateEmpty, dbReadUserById, validateBody } from "helper";

import { ErrorObject, ErrorResponse, handleCatchError } from "response";
import { checkAccessToken, checkPassword } from "validateRequest";
import { UserModelType, GQLContext } from "types";

export const updateUser: MutationResolvers<GQLContext>["updateUser"] = async (
  parent,
  args,
  { req, res }
) => {
  try {
    const userId = await checkAccessToken(req);
    await checkPassword(args.currentPassword!, userId);

    const bodyData = validateBody(args, 3);
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
