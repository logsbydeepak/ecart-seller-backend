import { JwtPayload, sign, verify } from "jsonwebtoken";

import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "config";
import { generateEncryption } from "./security.helper";

export const accessTokenGenerator = (id: string): string =>
  generateEncryption(
    sign({ id, type: "SELLER" }, ACCESS_TOKEN_SECRET as string, {
      expiresIn: "15m",
    })
  );

export const refreshTokenGenerator = (id: string): string =>
  generateEncryption(
    sign({ id, type: "SELLER" }, REFRESH_TOKEN_SECRET as string, {
      expiresIn: "30d",
    })
  );

export const accessTokenValidator = (
  token: string
): JwtPayload | null | "TokenExpiredError" => {
  try {
    return verify(token, ACCESS_TOKEN_SECRET as string) as JwtPayload;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return "TokenExpiredError";
    }
    return null;
  }
};

export const refreshTokenValidator = (
  token: string
): JwtPayload | null | "TokenExpiredError" => {
  try {
    return verify(token, REFRESH_TOKEN_SECRET as string) as JwtPayload;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return "TokenExpiredError";
    }
    return null;
  }
};
