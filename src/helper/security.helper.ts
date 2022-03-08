import { hash } from "bcryptjs";

export const generateHashAndSalt = async (rawPassword: string) => {
  const genHash = await hash(rawPassword, 10);
  return genHash;
};
