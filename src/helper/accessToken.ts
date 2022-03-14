import { Request } from "express";
import { UserContextType } from "types";

export const checkAccessToken = (req: Request): UserContextType => {
  return { id: "id", error: null };
};
