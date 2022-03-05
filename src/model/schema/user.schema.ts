import { Schema } from "mongoose";

const defaultProperty: {
  required: boolean;
  type: StringConstructor;
} = {
  required: true,
  type: String,
};

const UserSchema: Schema = new Schema({
  name: defaultProperty,
  email: defaultProperty,
  password: defaultProperty,
});

export default UserSchema;
