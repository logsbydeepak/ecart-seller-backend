import { ResolveMutation } from "~/types";
import { InvalidTokenModel, UserModel } from "~/db/model.db";
import { handleCatchError } from "~/helper/response.helper";
import { removeRefreshTokenCookie } from "~/helper/cookie.helper";

const deleteUser: ResolveMutation<"deleteUser"> = async (
  _,
  args,
  { req, res, validateAccessTokenMiddleware, validatePasswordMiddleware }
) => {
  try {
    const { userId, accessToken } = await validateAccessTokenMiddleware(req);
    await validatePasswordMiddleware(args.currentPassword, userId);

    const newAccessToken = new InvalidTokenModel({
      owner: userId,
      token: accessToken,
    });

    await UserModel.findByIdAndRemove(userId);
    await newAccessToken.save();

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
