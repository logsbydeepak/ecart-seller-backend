import { ResolveMutation } from "~/types";
import { TokenModel, UserModel } from "~/db/model.db";
import { handleCatchError } from "~/helper/response.helper";
import { removeRefreshTokenCookie } from "~/helper/cookie.helper";

const deleteUser: ResolveMutation<"deleteUser"> = async (
  _,
  __,
  { req, res, validateAccessTokenMiddleware }
) => {
  try {
    const { userId } = await validateAccessTokenMiddleware(req);

    await UserModel.findByIdAndRemove(userId);
    await TokenModel.findByIdAndRemove(userId);

    removeRefreshTokenCookie(res);

    return {
      __typename: "SuccessResponse",
      message: "user removed successfully",
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};

export default deleteUser;
