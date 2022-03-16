import { CookieOptions, Response } from "express";

const defaultConfig: CookieOptions = {
  httpOnly: true,
  maxAge: 86400000 * 90,
  secure: true,
  sameSite: "none",
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

export const removeAccessTokenCookie = (res: Response): Response =>
  res.clearCookie("accessToken", {
    ...defaultConfig,
  });

export const removeRefreshTokenCookie = (res: Response): Response =>
  res.clearCookie("refreshToken", {
    ...defaultConfig,
  });
