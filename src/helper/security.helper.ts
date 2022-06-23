import Cryptr from "cryptr";
import { compare, hash } from "bcryptjs";

import { ErrorObject } from "./response.helper";
import { ENCRYPT_SECRET } from "~/config/env.config";
import { ErrorMessageTitle } from "~/types";

const cryptr = new Cryptr(ENCRYPT_SECRET as string);

export const generateHashAndSalt = async (rawPassword: string) => {
  const genHash = await hash(rawPassword, 10);
  return genHash;
};

export const generateEncryption = (token: string): string =>
  cryptr.encrypt(token);

export const generateDecryption = (
  token: string,
  messageTitle: ErrorMessageTitle,
  message: string
) => {
  try {
    return cryptr.decrypt(token);
  } catch (error: any) {
    throw ErrorObject(messageTitle, message);
  }
};

export const validateHashAndSalt = async <T>(
  rawPassword: string,
  dbPassword: string,
  errorObj: T
): Promise<void> => {
  const comparePassword = await compare(rawPassword, dbPassword);

  if (!comparePassword) {
    throw errorObj;
  }
};
