import { Request, Response } from "express";

export type GQLContext = {
  req: Request;
  res: Response;
};
