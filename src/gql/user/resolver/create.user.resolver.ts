import { UserModel } from "../../../model";

export const createUser = async (
  _: any,
  args: { name: string; email: string; password: string }
) => {
  try {
    if (!args.name || !args.email || !args.password) {
      return { __typename: "Error", message: "Invalid args" };
    }

    const newUser = await new UserModel(args);
    newUser.save();
    return {
      __typename: "CreateUser",
      name: newUser.name,
      email: args.email,
    };
  } catch (e: any) {
    return { __typename: "Error", message: "Something went wrong" };
  }
};
