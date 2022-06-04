import { Mongoose } from "mongoose";
import { DB_URL_MAIN, DB_URL_SELLER } from "~/config/env.config";

export const DBBuyer = new Mongoose();
export const DBSeller = new Mongoose();

const connectToDB = (mongoose: Mongoose, url: string) => mongoose.connect(url);

export const connectToDBuyer = () =>
  connectToDB(DBBuyer, DB_URL_MAIN as string);
export const connectToDBSeller = () =>
  connectToDB(DBSeller, DB_URL_SELLER as string);
