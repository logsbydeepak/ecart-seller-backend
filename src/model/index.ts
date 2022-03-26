import { model, Model } from "mongoose";

import UserSchema from "./schema/user.schema";
import TokenSchema from "./schema/token.schema";
import ProductSchema from "./schema/product.schema";
import ReviewSchema from "./schema/review.schema";
import {
  ProductModelType,
  ReviewModelType,
  TokenModelType,
  UserModelType,
} from "types";

export const UserModel: Model<UserModelType> = model("users", UserSchema);
export const TokenModel: Model<TokenModelType> = model("tokens", TokenSchema);
export const ReviewModel: Model<ReviewModelType> = model(
  "reviews",
  ReviewSchema
);
export const ProductModel: Model<ProductModelType> = model(
  "products",
  ProductSchema
);
