import { ALLOW_ORIGIN } from "@config/env";
import { CorsOptions } from "apollo-server-express";

export const corsOption: CorsOptions = {
  origin: ALLOW_ORIGIN,
  credentials: true,
};
