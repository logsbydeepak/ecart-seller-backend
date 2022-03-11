import { ALLOW_ORIGIN, NODE_ENV } from "@config/env";
import { CorsOptions } from "apollo-server-express";
import { HelmetOptions } from "helmet";

const isProduction = NODE_ENV === "prod";

export const corsOption: CorsOptions = {
  origin: ALLOW_ORIGIN,
  credentials: true,
};

export const helmetOption: HelmetOptions = {
  contentSecurityPolicy: isProduction,
  crossOriginEmbedderPolicy: isProduction,
};
