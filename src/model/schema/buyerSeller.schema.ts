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

const BuyerUserSchema: Schema = new Schema({
  name: defaultProperty,
  email: defaultProperty,
  password: defaultProperty,
});

BuyerUserSchema.post("validate", async function () {
  this.name = validateEmpty(this.name, "BODY_PARSE", "name is required");
  this.email = validateEmail(this.email);
  this.password = validatePassword(this.password);
  await dbEmailExist(this.email, "BUYER");

  if (!this.isModified("password")) return;
  this.password = await generateHashAndSalt(this.password);
  return;
});

export default BuyerUserSchema;