import { GQLResponse, GQLResponseType } from "~/types/graphqlHelper";
import { UserModel } from "~/db/model.db";
import { UserAlreadyExistError } from "~/types/graphql";

export const dbEmailExist = async <T extends GQLResponseType>(
  email: string,
  emailError: GQLResponse<T>
) => {
  const emailCount = await UserModel.count({ email });

  if (emailCount !== 0) {
    throw emailError;
  }
};

export const dbUserExist = async (userId: string): Promise<void> => {
  const idCount = await UserModel.count({
    _id: userId,
  });

  if (idCount === 0) {
    throw ErrorObject("AUTHENTICATION", "user do not exist");
  }
};

export const dbReadUserByEmail = async (email: string) => {
  const dbUser = await UserModel.findOne({ email });

  if (!dbUser) {
    throw ErrorObject("AUTHENTICATION", "user do not exist");
  }

  return dbUser;
};
