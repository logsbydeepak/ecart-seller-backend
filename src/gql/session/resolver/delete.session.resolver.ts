import { ResolveMutation } from "~/types";
import { handleCatchError } from "~/helper/response.helper";
import { removeRefreshTokenCookie } from "~/helper/cookie.helper";

const deleteSession: ResolveMutation<"deleteSession"> = async (
  _,
  __,
  { req, res, validateAccessTokenMiddleware }
) => {
  try {
    const { userId, accessToken } = await validateAccessTokenMiddleware(req);

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
