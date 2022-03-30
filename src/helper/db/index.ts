import { DB_URL_MAIN, DB_URL_SELLER } from "config";
import mongoose from "mongoose";

export * from "./token.db";
export * from "./user.db";

export const establishDBConnection = (DB_URL: string, DBName: string) => {
  const db = mongoose.createConnection(DB_URL);

  db.on("open", () => {
    console.log(`${DBName} || DB connection established successfully`);
  });

  db.on("error", () => {
    console.log(`${DBName} || ${DB_URL} || Error establishing DB connection`);
    process.exit(1);
  });

  return db;
};

export const DB_MAIN = establishDBConnection(DB_URL_MAIN as string, "main");
export const DB_SELLER = establishDBConnection(
  DB_URL_SELLER as string,
  "seller"
);
