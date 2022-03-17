import {
  validateBody,
  validateEmail,
  validateEmpty,
  validatePassword,
} from "@helper/validator";

import { dbReadUserById, dbEmailExist } from "@helper/db";
import { ErrorResponse, handleCatchError } from "@response";
import { UserModelType, UpdateUserBodyType, GQLContext } from "@types";
import { MutationResolvers } from "types/graphql";
import checkAccessToken from "@helper/checkAccessToken";

export const updateUser: MutationResolvers<GQLContext>["updateUser"] = async (
  parent,
  args,
  { req, res }
) => {
  try {
    // @ts-ignore
    const { id: userId } = await checkAccessToken(req);

    const bodyData: UpdateUserBodyType = validateBody(args, 3);
    const toUpdate: string = validateEmpty(bodyData.toUpdate, "BP", 18);

    const dbUser: UserModelType = await dbReadUserById(userId);
    let toUpdateValue: string;

    switch (toUpdate) {
      case "name":
        toUpdateValue = validateEmpty(bodyData.name, "BP", 13);
        break;

      case "email":
        toUpdateValue = validateEmail(bodyData.email);
        await dbEmailExist(validateEmail(toUpdateValue));
        break;

      case "password":
        toUpdateValue = validatePassword(bodyData.password);
        break;

      default:
        return ErrorResponse("BP", 19);
    }

    dbUser[toUpdate] = toUpdateValue;
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
