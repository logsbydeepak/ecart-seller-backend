import { Model } from "mongoose";

import UserSchema from "./schema/user.schema";
import ProductSchema from "./schema/product.schema";
import ReviewSchema from "./schema/review.schema";
import { DBSeller, DBBuyer } from "./connection.db";
import { ProductModelType, ReviewModelType, UserModelType } from "~/types";

export const UserModel: Model<UserModelType> = DBSeller.model(
  "sellerUsers",
  UserSchema
);

export const ReviewModel: Model<ReviewModelType> = DBBuyer.model(
  "reviews",
  ReviewSchema
);

export const ProductModel: Model<ProductModelType> = DBBuyer.model(
  "products",
  ProductSchema
);
