import { Schema } from "mongoose";

const { ObjectId } = Schema.Types;

const ProductSchema: Schema = new Schema({
  owner: { type: ObjectId, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
});

export default ProductSchema;
