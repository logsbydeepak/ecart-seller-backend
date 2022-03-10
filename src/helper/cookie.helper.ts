import { NODE_ENV } from "@config/env";
import { CookieOptions, Response } from "express";

const defaultConfig: CookieOptions = {
  httpOnly: true,
  maxAge: 86400000 * 90,
  secure: NODE_ENV === "prod",
  sameSite: NODE_ENV === "prod" ? "none" : false,
};

export const setAccessTokenCookie = (
  res: Response,
  accessToken: string
): Response => res.cookie("accessToken", accessToken, { ...defaultConfig });

export const setRefreshTokenCookie = (
  res: Response,
  refreshToken: string
): Response =>
  res.cookie("refreshToken", refreshToken, {
    ...defaultConfig,
  });
