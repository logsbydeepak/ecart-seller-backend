import { sign } from "jsonwebtoken";

import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "@config/env";

export const accessTokenGenerator = (id: string): string =>
  sign({ id }, ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });

export const refreshTokenGenerator = (
  id: string,
  refreshTokenRefreshCount: number
): string =>
  sign({ id, refreshTokenRefreshCount }, REFRESH_TOKEN_SECRET as string, {
    expiresIn: "30d",
  });
