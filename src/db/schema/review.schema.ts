import { Schema } from "mongoose";

import { ReviewModelType } from "~/types";

const { ObjectId } = Schema.Types;

const ReviewSchema = new Schema<ReviewModelType>({
  productId: ObjectId,
  buyerId: ObjectId,
  comment: String,
});

export default ReviewSchema;
