import { handleCatchError } from "~/helper/response.helper";
import { GQLResolvers } from "~/types/index";
import { validateBase64 } from "~/helper/validator.helper";

const updateUserPicture: GQLResolvers = {
  Mutation: {
    updateUserPicture: async (
      _parent,
      args,
      { req, validateTokenMiddleware }
    ) => {
      try {
        await validateTokenMiddleware(req);

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

        return {
          __typename: "UpdateUserPictureResponse",
          picture: args.file,
        };
      } catch (error) {
        return handleCatchError(error);
      }
    },
  },
};

export default updateUserPicture;
