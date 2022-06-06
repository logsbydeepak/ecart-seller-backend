import { ResolveMutation } from "~/types";
import { dbEmailExist, dbReadUserById } from "~/db/query/user.query";

import {
  validateBody,
  validateEmail,
  validateEmpty,
  validatePassword,
} from "~/helper/validator.helper";

import { ErrorObject, handleCatchError } from "~/helper/response.helper";

const updateUser: ResolveMutation<"updateUser"> = async (
  _,
  args,
  { req, validateTokenMiddleware, validatePasswordMiddleware }
) => {
  try {
    const bodyData = validateBody(args, 3);
    const { userId } = await validateTokenMiddleware(req);
    await validatePasswordMiddleware(bodyData.currentPassword, userId);

    const toUpdate: string = validateEmpty(
      bodyData.toUpdate,
      "BODY_PARSE",
      "toUpdate is required"
    );

    const dbUser = await dbReadUserById(userId);

    switch (toUpdate) {
      case "name":
        if (!args.name?.firstName || !args.name?.lastName) {
          ErrorObject("BODY_PARSE", "name is required");
        }

        if (args.name?.firstName) {
          const firstName = validateEmpty(
            bodyData.firstName,
            "BODY_PARSE",
            "firstName is required"
          );
          dbUser.firstName = firstName;
        }

        if (args.name?.lastName) {
          const lastName = validateEmpty(
            bodyData.lastName,
            "BODY_PARSE",
            "lastName is required"
          );
          dbUser.lastName = lastName;
        }
        break;

      case "email":
        const email = validateEmail(bodyData.email);
        dbEmailExist(email);
        dbUser.email = email;
        break;

      case "password":
        const password = validatePassword(bodyData.password);
        dbUser.password = password;
        break;

      default:
        throw ErrorObject("BODY_PARSE", "invalid toUpdate");
    }

    await dbUser.save();

    return {
      __typename: "User",
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      email: dbUser.email,
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};

export default { Mutation: { updateUser } };
