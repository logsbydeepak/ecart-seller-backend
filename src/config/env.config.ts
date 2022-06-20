import { env } from "process";
import { resolve } from "path";
import { config } from "dotenv";

// get the root path of the project to import .env file
const rootPath: string = resolve(`${__dirname}../../../`);
export const { NODE_ENV } = env;

if (NODE_ENV === "development") config({ path: `${rootPath}/.env.dev` });

export const {
  PORT,
  DB_URL_MAIN,
  DB_URL_SELLER,
  DB_URL_LOGGER,
  TOKEN_SECRET,
  REDIS_URL,
  ALLOW_ORIGIN,
  ENCRYPT_SECRET,
} = env;
