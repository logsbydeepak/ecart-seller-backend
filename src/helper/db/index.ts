import { DB_URL_MAIN, DB_URL_SELLER } from "config";
import mongoose from "mongoose";
import { dbUserExist } from "./user.db";

export * from "./token.db";
export * from "./user.db";

export const establishDBConnection = (DB_URL: string, DBName: string) => {
  mongoose.createConnection(DB_URL);

  mongoose.connection.on("open", () => {
    console.log(`${DBName} | DB connection established successfully`);
  });

  mongoose.connection.on("error", () => {
    console.log(`${DBName} | ${DB_URL} | Error establishing DB connection`);
    process.exit(1);
  });

  return mongoose.connection;
};

export const DB_MAIN = establishDBConnection(DB_URL_MAIN as string, "main");
export const DB_SELLER = establishDBConnection(
  DB_URL_SELLER as string,
  "seller"
);
