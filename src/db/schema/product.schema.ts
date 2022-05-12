import {
  validateCategory,
  validateIsPublic,
  validateProductDescription,
  validateProductName,
} from "helper";
import { Schema } from "mongoose";
import { ProductModelType } from "types";

const { ObjectId } = Schema.Types;

const ProductSchema: Schema = new Schema<ProductModelType>({
  owner: { type: ObjectId, required: true },
  category: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  isPublic: { type: Boolean, required: true },
});

ProductSchema.post("validate", async function () {
  this.category = validateCategory(this.category);
  this.name = validateProductName(this.name);
  this.description = validateProductDescription(this.description);
  this.isPublic = validateIsPublic(this.isPublic);
  return;
});

export default ProductSchema;
