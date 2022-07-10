import { Model } from "mongoose";

import { DBSeller } from "./connection.db";
import UserSchema, { UserSchemaType } from "./schema/user.schema";

export const UserModel: Model<UserSchemaType> = DBSeller.model(
  "sellerUsers",
  UserSchema,
);