import { createConnection, Model } from "mongoose";

import {
  ProductModelType,
  ReviewModelType,
  TokenModelType,
  UserModelType,
} from "~/types";

import UserSchema from "./schema/user.schema";
import ProductSchema from "./schema/product.schema";
import ReviewSchema from "./schema/review.schema";
import { DB_URL_MAIN, DB_URL_SELLER } from "~/config/env.config";

export const DB_MAIN = createConnection(DB_URL_MAIN as string);
export const DB_SELLER = createConnection(DB_URL_SELLER as string);

export const UserModel: Model<UserModelType> = DB_MAIN.model(
  "sellerUsers",
  UserSchema
);

export const ReviewModel: Model<ReviewModelType> = DB_MAIN.model(
  "reviews",
  ReviewSchema
);

export const ProductModel: Model<ProductModelType> = DB_MAIN.model(
  "products",
  ProductSchema
);
