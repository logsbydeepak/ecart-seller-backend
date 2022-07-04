import { handleCatchError } from "~/helper/response.helper";

import { GQLResolvers } from "~/types/index";
import { dbReadUserById } from "~/db/query/user.query";
import cloudinary from "~/config/cloudinary.config";

const removeUserPicture: GQLResolvers = {
  Mutation: {
    removeUserPicture: async (
      _parent,
      args,
      { req, validateTokenMiddleware, validatePasswordMiddleware }
    ) => {
      try {
        const { userId } = await validateTokenMiddleware(req);
        const dbUser = await dbReadUserById<"removeUserPicture">(userId, {
          __typename: "TokenError",
          type: "TokenUserDoNotExistError",
          message: "user do not exist",
        });

        if (dbUser.picture !== "default")
          await cloudinary.uploader.destroy(dbUser.picture);

        dbUser.picture = "default";

        await dbUser.save();

        return {
          __typename: "SuccessResponse",
          message: 'picture" has been removed',
        };
      } catch (error) {
        return handleCatchError(error);
      }
    },
  },
};

export default removeUserPicture;
