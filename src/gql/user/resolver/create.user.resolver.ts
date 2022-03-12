import {
  validateBody,
  validateEmail,
  validateEmpty,
  validatePassword,
} from "@helper/validator";
import { TokenModel, UserModel } from "@model";
import { dbEmailExist } from "helper/db,helper";
import { accessTokenGenerator, refreshTokenGenerator } from "@helper/token";

import { setAccessTokenCookie, setRefreshTokenCookie } from "@helper/cookie";
import {
  Maybe,
  MutationCreateUserArgs,
  Resolver,
  ResolversTypes,
} from "types/graphql";
import { GQLContext } from "@gql/resolver";

type CreateUserType = Resolver<
  Maybe<ResolversTypes["CreateUserResponse"]>,
  {},
  GQLContext,
  Partial<MutationCreateUserArgs>
>;

export const createUser: CreateUserType = async (_, args, { res }) => {
  try {
    const reqData = validateBody(args, 3);
    const name = validateEmpty(reqData.name, "name is requried");
    const email = validateEmail(reqData.email);
    const password = validatePassword(reqData.password);

    await dbEmailExist(email);

    const newUser = await new UserModel({ name, email, password });
    const accessToken = accessTokenGenerator(newUser._id);
    const refreshToken = refreshTokenGenerator(newUser._id, 3);

    const newToken = await new TokenModel({
      owner: newUser._id,
      refreshToken,
      accessToken,
    });

    await newUser.save();
    await newToken.save();

    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    return {
      __typename: "User",
      name: newUser.name,
      email: args.email,
    };
  } catch (error: any) {
    if (error.__typename === "ErrorResponse") {
      return {
        __typename: "ErrorResponse",
        title: "INTERNAL_SERVER",
        message: "Something went wrong",
      };
      // return error;
    }

    return {
      __typename: "ErrorResponse",
      title: "INTERNAL_SERVER",
      message: "Something went wrong",
    };
  }
};
