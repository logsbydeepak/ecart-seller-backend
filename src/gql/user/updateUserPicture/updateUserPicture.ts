import { UserModel } from "~/db/model.db";
import cloudinary from "~/config/cloudinary.config";
import { GQLResolvers } from "~/types/graphqlHelper";
import { handleCatchError } from "~/helper/response.helper";
import { TokenUserDoNotExistError } from "~/helper/error.helper";

const updateUserPicture: GQLResolvers = {
  Mutation: {
    updateUserPicture: async (
      _parent,
      args,
      { req, validateTokenMiddleware }
    ) => {
      try {
        const { tokenData, tokenError } = await validateTokenMiddleware(req);
        if (tokenError) return tokenError;
        const { userId } = tokenData;

        const image = args.file;

        const dbUser = await UserModel.findById(userId, { picture: 1, _id: 0 });
        if (!dbUser) return TokenUserDoNotExistError;

        if (dbUser.picture === "default") {
          const file = await uploadUserPictureToCDN(image);
          dbUser.picture = file.public_id;
        } else {
          await cloudinary.uploader.destroy(dbUser.picture);
          const file = await uploadUserPictureToCDN(image);
          dbUser.picture = file.public_id;
        }

        await dbUser.save();

        return {
          __typename: "UpdateUserPictureSuccessResponse",
          picture: "default",
        };
      } catch (error) {
        return handleCatchError();
      }
    },
  },
};

const uploadUserPictureToCDN = async (image: string) =>
  await cloudinary.uploader.upload(image, {
    folder: `ecart_seller_user_picture`,
    overwrite: true,
  });

export default updateUserPicture;
