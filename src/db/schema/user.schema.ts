import { ObjectId, Schema } from "mongoose";

import { generateHashAndSalt } from "~/helper/security.helper";

const defaultProperty = {
  required: true,
  type: String,
};

export interface UserSchemaType extends Document {
  _id: ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  picture: string | "default";
}

const UserSchema = new Schema<UserSchemaType>({
  firstName: defaultProperty,
  lastName: defaultProperty,
  email: defaultProperty,
  password: defaultProperty,
  picture: defaultProperty,
});

UserSchema.post("validate", async function () {
  if (!this.isModified("password")) return;
  this.password = await generateHashAndSalt(this.password);
  return;
});

export default UserSchema;
