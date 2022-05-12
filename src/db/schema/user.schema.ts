import { Schema } from "mongoose";

import {
  dbEmailExist,
  generateHashAndSalt,
  validateEmail,
  validateEmpty,
  validatePassword,
} from "helper";
import { UserModelType } from "types";

const defaultProperty = {
  required: true,
  type: String,
};

const UserSchema = new Schema<UserModelType>({
  name: defaultProperty,
  email: defaultProperty,
  password: defaultProperty,
});

UserSchema.post("validate", async function () {
  this.name = validateEmpty(this.name, "BODY_PARSE", "name is required");
  this.email = validateEmail(this.email);
  this.password = validatePassword(this.password);
  await dbEmailExist(this.email);
  if (!this.isModified("password")) return;
  this.password = await generateHashAndSalt(this.password);
  return;
});

export default UserSchema;
