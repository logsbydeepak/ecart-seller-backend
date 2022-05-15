import { Schema } from "mongoose";
import { generateHashAndSalt } from "~/helper/security.helper";

import {
  validateEmail,
  validateEmpty,
  validatePassword,
} from "~/helper/validator.helper";

import { UserModelType } from "~/types";
import { dbEmailExist } from "../query/user.query";

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
