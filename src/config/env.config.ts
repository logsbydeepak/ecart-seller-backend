import { env } from "process";
import { resolve } from "path";
import { config } from "dotenv";

// get the root path of the project to import .env file
const rootPath: string = resolve(`${__dirname}../../../`);
export const { NODE_ENV } = env;

if (NODE_ENV !== "prod") {
  config({ path: `${rootPath}/${NODE_ENV}.env` });
}

export const {
  PORT,
  DB_URL_MAIN,
  DB_URL_SELLER,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ALLOW_ORIGIN,
  ENCRYPT_SECRET,
} = env;
