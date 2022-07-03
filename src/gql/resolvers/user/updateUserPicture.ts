import { handleCatchError } from "~/helper/response.helper";
import { GQLResolvers } from "~/types/index";
import { validateBase64 } from "~/helper/validator.helper";
import cloudinary from "~/config/cloudinary.config";
import { dbReadUserById } from "~/db/query/user.query";

const updateUserPicture: GQLResolvers = {
  Mutation: {
    updateUserPicture: async (
      _parent,
      args,
      { req, validateTokenMiddleware }
    ) => {
      try {
        const { userId } = await validateTokenMiddleware(req);

        const image = validateBase64<"updateUserPicture">(
          args.file,
          {
            __typename: "UpdateUserPictureCredentialError",
            message: "image is required",
          },
          {
            __typename: "UpdateUserPictureCredentialError",
            message: "image is invalid",
          }
        );

        const file = await cloudinary.uploader.upload(image, {
          folder: `ecart_seller_user_picture`,
          overwrite: true,
          public_id: userId,
        });

        const dbUser = await dbReadUserById<"updateUserPicture">(userId, {
          __typename: "TokenError",
          type: "TokenUserDoNotExistError",
          message: "user do not exist",
        });

        dbUser.picture = file.public_id;
        await dbUser.save();

        return {
          __typename: "UpdateUserPictureSuccessResponse",
          picture: "default",
        };
      } catch (error) {
        return handleCatchError(error);
      }
    },
  },
};

export default updateUserPicture;
