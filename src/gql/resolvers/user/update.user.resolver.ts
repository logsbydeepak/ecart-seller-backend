import {
  validateEmail,
  validateEmpty,
  validatePassword,
} from "~/helper/validator.helper";

import { handleCatchError } from "~/helper/response.helper";

import { GQLResolvers } from "~/types";
import { MutationUpdateUserArgs } from "~/types/graphql";

import { dbEmailExist, dbReadUserById } from "~/db/query/user.query";

const UpdateUser: GQLResolvers = {
  Mutation: {
    updateUser: async (
      _parent,
      args,
      { req, validateTokenMiddleware, validatePasswordMiddleware }
    ) => {
      try {
        const { userId } = await validateTokenMiddleware(req);

        await validatePasswordMiddleware<"updateUser">(
          args.currentPassword,
          userId,
          {
            __typename: "UpdateUserCredentialError",
            field: "currentPassword",
            message: "currentPassword is required",
          },
          {
            __typename: "UpdateUserCredentialError",
            field: "currentPassword",
            message: "invalid currentPassword",
          }
        );

        const { toUpdate, firstName, lastName, email, password } =
          validateUpdateUserArgs(args);

        const dbUser = await dbReadUserById<"updateUser">(userId, {
          __typename: "TokenError",
          type: "TokenUserDoNotExistError",
          message: "user not found",
        });

        if (toUpdate === "name") {
          dbUser.firstName = firstName as string;
          dbUser.lastName = lastName as string;
        }

        if (toUpdate === "email") {
          await dbEmailExist<"updateUser">(email as string, {
            __typename: "UserAlreadyExistError",
            message: "email already exist",
          });
          dbUser.email = email as string;
        }

        if (toUpdate === "password") {
          dbUser.password = password as string;
        }

        await dbUser.save();

        return {
          __typename: "User",
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          email: dbUser.email,
          picture: "default",
        };
      } catch (error) {
        return handleCatchError(error);
      }
    },
  },
};

const validateUpdateUserArgs = (args: MutationUpdateUserArgs) => {
  let firstName, lastName, email, password, currentPassword;

  const toUpdate = validateEmpty<"updateUser">(args.toUpdate, {
    __typename: "UpdateUserCredentialError",
    field: "toUpdate",
    message: "toUpdate is required",
  });

  if (!["name", "email", "password"].includes(toUpdate)) {
    throw {
      __typename: "UpdateUserCredentialError",
      field: "toUpdate",
      message: "toUpdate is invalid",
    };
  }

  if (toUpdate === "password") {
    password = validatePassword<"updateUser">(
      args.password,
      {
        __typename: "UpdateUserCredentialError",
        field: "password",
        message: "password is required",
      },
      {
        __typename: "UpdateUserCredentialError",
        field: "password",
        message: "invalid password",
      }
    );
  }

  if (toUpdate === "email") {
    email = validateEmail<"updateUser">(
      args.email,
      {
        __typename: "UpdateUserCredentialError",
        field: "email",
        message: "email is required",
      },
      {
        __typename: "UpdateUserCredentialError",
        field: "email",
        message: "invalid email",
      }
    );
  }

  if (toUpdate === "name") {
    firstName = validateEmpty<"updateUser">(args.name?.firstName, {
      __typename: "UpdateUserCredentialError",
      field: "name",
      message: "firstName is required",
    });

    lastName = validateEmpty<"updateUser">(args.name?.lastName, {
      __typename: "UpdateUserCredentialError",
      field: "name",
      message: "firstName is required",
    });
  }

  return { toUpdate, email, password, firstName, lastName };
};

export default UpdateUser;
