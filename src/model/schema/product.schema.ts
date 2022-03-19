import { Schema } from "mongoose";

const { ObjectId } = Schema.Types;

const ProductSchema: Schema = new Schema({
  owner: { type: ObjectId, required: true },
  category: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  isPublic: { type: Boolean, required: true },
});

export default ProductSchema;
