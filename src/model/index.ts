import { model } from "mongoose";

import UserSchema from "./schema/user.schema";

export const UserModel = model("users", UserSchema);
