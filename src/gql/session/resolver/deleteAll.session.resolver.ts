import { ResolveMutation } from "~/types";
import { InvalidTokenModel } from "~/db/model.db";
import { handleCatchError } from "~/helper/response.helper";
import { removeRefreshTokenCookie } from "~/helper/cookie.helper";

const deleteAllSession: ResolveMutation<"deleteAllSession"> = async (
  _,
  args,
  { req, res, validateAccessTokenMiddleware, validatePasswordMiddleware }
) => {
  try {
    const { userId, accessToken } = await validateAccessTokenMiddleware(req);
    await validatePasswordMiddleware(args.currentPassword, userId);

    await InvalidTokenModel.deleteMany({ owner: userId });

    const newAccessToken = new InvalidTokenModel({
      owner: userId,
      token: accessToken,
    });
    await newAccessToken.save();

    removeRefreshTokenCookie(res);

    res.statusCode = 204;
    return {
      __typename: "SuccessResponse",
      message: "session removed successfully",
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};

export default deleteAllSession;
