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
  picture: string | null;
}

const UserSchema = new Schema<UserSchemaType>({
  firstName: defaultProperty,
  lastName: defaultProperty,
  email: defaultProperty,
  password: defaultProperty,
  picture: { required: false, type: String, default: null },
});

UserSchema.post("validate", async function () {
  if (!this.isModified("password")) return;
  this.password = await generateHashAndSalt(this.password);
  return;
});

export default UserSchema;
