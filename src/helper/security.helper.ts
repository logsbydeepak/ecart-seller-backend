import Cryptr from "cryptr";
import { compare, hash } from "bcryptjs";

import { ENCRYPT_SECRET } from "~/config/env.config";
import { GQLResponse, GQLResponseType } from "~/types/graphqlHelper";

const cryptr = new Cryptr(ENCRYPT_SECRET as string);

export const generateHashAndSalt = async (rawPassword: string) => {
  const genHash = await hash(rawPassword, 10);
  return genHash;
};

export const generateEncryption = (token: string): string =>
  cryptr.encrypt(token);

export const generateDecryption = (token: string) => {
  try {
    return cryptr.decrypt(token);
  } catch (error: any) {
    return null;
  }
};

export const validatePassword = async ({
  rawPassword,
  dbPassword,
}: {
  rawPassword: string;
  dbPassword: string;
}) => await compare(rawPassword, dbPassword);
