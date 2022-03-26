import { Schema } from "mongoose";

const { ObjectId } = Schema.Types;

const ReviewSchema: Schema = new Schema({
  productId: ObjectId,
  buyerId: ObjectId,
  comment: String,
});

export default ReviewSchema;
