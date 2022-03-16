import Cryptr from "cryptr";
import { compare, hash } from "bcryptjs";

import { ENCRYPT_SECRET, REFRESH_TOKEN_SECRET } from "@config/env";
import { ErrorObject } from "@response";

const cryptr = new Cryptr(ENCRYPT_SECRET as string);

export const generateHashAndSalt = async (rawPassword: string) => {
  const genHash = await hash(rawPassword, 10);
  return genHash;
};

export const generateEncryption = (token: string): string =>
  cryptr.encrypt(token);

export const generateDecryption = (
  token: string,
  messageCodeType: string,
  messageCode: number
): string => {
  try {
    return cryptr.decrypt(token);
  } catch (error: any) {
    throw ErrorObject(messageCodeType, messageCode);
  }
};

export const validateHashAndSalt = async (
  rawPassword: string,
  dbPassword: string
): Promise<void> => {
  const comparePassword = await compare(rawPassword, dbPassword);

  if (!comparePassword) {
    throw ErrorObject("BP", 20);
  }
};
