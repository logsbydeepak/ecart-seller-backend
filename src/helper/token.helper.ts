import { JwtPayload, sign, verify } from "jsonwebtoken";

import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "config";
import { UserType } from "types";

export const accessTokenGenerator = (id: string, userType: UserType): string =>
  sign({ id, type: userType }, ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });

export const refreshTokenGenerator = (
  id: string,
  userType: UserType,
  refreshTokenRefreshCount: number
): string =>
  sign(
    { id, refreshTokenRefreshCount, type: userType },
    REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "30d",
    }
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
