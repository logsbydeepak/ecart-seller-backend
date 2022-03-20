import { Schema } from "mongoose";

import {
  dbEmailExist,
  generateHashAndSalt,
  validateEmail,
  validateEmpty,
  validatePassword,
} from "helper";

const defaultProperty = {
  required: true,
  type: String,
};

const UserSchema: Schema = new Schema({
  name: defaultProperty,
  email: defaultProperty,
  password: defaultProperty,
});

UserSchema.post("validate", async function (next) {
  this.name = validateEmpty(this.name, "BP", 13);
  this.email = validateEmail(this.email);
  this.password = validatePassword(this.password);
  await dbEmailExist(this.email);

  if (!this.isModified("password")) return next();
  this.password = await generateHashAndSalt(this.password);
  return next();
});

export default UserSchema;
