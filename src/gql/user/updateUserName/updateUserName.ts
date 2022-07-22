import * as yup from "yup";
import { UserModel } from "~/db/model.db";
import { TokenUserDoNotExistError } from "~/helper/error.helper";

import { GQLResolvers } from "~/types/graphqlHelper";
import { handleCatchError } from "~/helper/response.helper";
import { MutationUpdateUserNameArgs } from "~/types/graphql";
import { firstName, lastName, validateData } from "~/helper/validator.helper";

const validateSchema = yup.object({
  firstName,
  lastName,
});

const updateUserName: GQLResolvers = {
  Mutation: {
    updateUserName: async (_parent, args, { req, validateTokenMiddleware }) => {
      try {
        const validateToken = await validateTokenMiddleware(req);
        if (validateToken.isError) return validateToken.error;
        const { userId } = validateToken;

        const validatedArgs = await validateData<typeof validateSchema>(
          validateSchema,
          args
        );

        if (validatedArgs.isError) {
          return {
            __typename: "UpdateUserNameArgsError",
            field: validatedArgs.error.path as keyof MutationUpdateUserNameArgs,
            message: validatedArgs.error.message,
          };
        }

        const dbUser = await UserModel.findByIdAndUpdate(userId, {
          firstName: validatedArgs.data.firstName,
          lastName: validatedArgs.data.lastName,
        });

        if (!dbUser) return TokenUserDoNotExistError;

        return {
          __typename: "UpdateUserNameSuccessResponse",
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
        };
      } catch (error) {
        return handleCatchError();
      }
    },
  },
};

export default updateUserName;
