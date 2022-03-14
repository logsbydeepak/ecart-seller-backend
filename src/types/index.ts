import { Response } from "express";
import { ErrorResponse } from "./graphql";

export type UserContextType =
  | { id: string; error: null }
  | { id: null; error: ErrorResponse };

export type GQLContext = {
  res: Response;
  user: UserContextType;
};
