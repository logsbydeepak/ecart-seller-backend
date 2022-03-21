import { validateCatergory, validateIsPublic } from "helper";
import { Schema } from "mongoose";

const { ObjectId } = Schema.Types;

const ProductSchema: Schema = new Schema({
  owner: { type: ObjectId, required: true },
  category: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  isPublic: { type: Boolean, required: true },
});

ProductSchema.post("validate", async function () {
  this.category = validateCatergory(this.category);
  this.isPublic = validateIsPublic(this.isPublic);

  return;
});

export default ProductSchema;
