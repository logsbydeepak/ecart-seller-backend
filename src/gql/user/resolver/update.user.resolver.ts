import { ResolveMutation } from "~/types";
import { dbReadUserById } from "~/db/query/user.query";
import { validateBody, validateEmpty } from "~/helper/validator.helper";
import { ErrorObject, handleCatchError } from "~/helper/response.helper";

const updateUser: ResolveMutation<"updateUser"> = async (
  _,
  args,
  { req, validateAccessTokenMiddleware, validatePasswordMiddleware }
) => {
  try {
    const bodyData = validateBody(args, 3);
    const { userId } = await validateAccessTokenMiddleware(req);
    await validatePasswordMiddleware(bodyData.currentPassword, userId);

    const toUpdate: string = validateEmpty(
      bodyData.toUpdate,
      "BODY_PARSE",
      "toUpdate is required"
    );

    const dbUser = await dbReadUserById(userId);

    switch (toUpdate) {
      case "name":
        if (args.name?.firstName) dbUser.firstName = args.name.firstName;
        if (args.name?.lastName) dbUser.lastName = args.name.lastName;
        break;

      case "email":
        dbUser.email = bodyData.email;
        break;

      case "password":
        dbUser.email = bodyData.email;
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

export default updateUser;
