import { model } from "mongoose";

import UserSchema from "./schema/user.schema";
import TokenSchema from "./schema/token.schema";

export const UserModel = model("users", UserSchema);
export const TokenModel = model("users", TokenSchema);
