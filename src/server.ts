import { dbConnect } from "./config/db.config";
import { connection } from "mongoose";

dbConnect();
connection.on("open", () => {
  // start server
});
