import { UserModel } from "~/db/model.db";
import cloudinary from "~/config/cloudinary.config";
import { GQLResolvers } from "~/types/graphqlHelper";

import { handleCatchError } from "~/helper/response.helper";
import { TokenUserDoNotExistError } from "~/helper/error.helper";

const removeUserPicture: GQLResolvers = {
  Mutation: {
    removeUserPicture: async (
      _parent,
      args,
      { req, validateTokenMiddleware }
    ) => {
      try {
        const { tokenData, tokenError } = await validateTokenMiddleware(req);
        if (tokenError) return tokenError;
        const { userId } = tokenData;

        const dbUser = await UserModel.findById(userId, {
          _id: 0,
          picture: 1,
        });

        if (!dbUser) return TokenUserDoNotExistError;

        if (dbUser.picture !== "default") {
          await cloudinary.uploader.destroy(dbUser.picture);
          dbUser.picture = "default";
          await dbUser.save();
        }

        return {
          __typename: "RemoveUserPictureSuccessResponse",
          picture: "default",
        };
      } catch (error) {
        return handleCatchError();
      }
    },
  },
};

export default removeUserPicture;
