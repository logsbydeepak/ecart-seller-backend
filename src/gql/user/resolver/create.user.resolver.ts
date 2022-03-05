import { UserModel } from "../../../model";

export const createUser = async (
  _: any,
  args: { name: string; email: string; password: string }
) => {
  const newUser = await new UserModel(args);
  newUser.save();
  return { name: newUser.name, email: newUser.email };
};
