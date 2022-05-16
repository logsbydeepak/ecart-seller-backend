import { ResolveMutation } from "~/types";
import { TokenModel } from "~/db/model.db";
import { handleCatchError } from "~/helper/response.helper";
import { removeRefreshTokenCookie } from "~/helper/cookie.helper";

const deleteSession: ResolveMutation<"deleteSession"> = async (
  _,
  __,
  { req, res, validateAccessTokenMiddleware }
) => {
  try {
    await validateAccessTokenMiddleware(req);
    const { accessToken } = req.cookies;

    await TokenModel.deleteOne({ accessToken });

    removeRefreshTokenCookie(res);

    return {
      __typename: "SuccessResponse",
      message: "session removed successfully",
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};

export default deleteSession;
