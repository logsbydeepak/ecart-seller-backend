import { Schema } from "mongoose";

import { UserModelType } from "~/types";
import { generateHashAndSalt } from "~/helper/security.helper";

const defaultProperty = {
  required: true,
  type: String,
};

const UserSchema = new Schema<UserModelType>({
  firstName: defaultProperty,
  lastName: defaultProperty,
  email: defaultProperty,
  password: defaultProperty,
});

UserSchema.post("validate", async function () {
  if (!this.isModified("password")) return;
  this.password = await generateHashAndSalt(this.password);
  return;
});

export default UserSchema;
