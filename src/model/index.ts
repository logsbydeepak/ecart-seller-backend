import { model, Model } from "mongoose";

import TokenSchema from "./schema/token.schema";
import SellerUserSchema from "./schema/sellerUser.schema";
import BuyerUserSchema from "./schema/buyerSeller.schema";
import ProductSchema from "./schema/product.schema";
import ReviewSchema from "./schema/review.schema";
import {
  ProductModelType,
  ReviewModelType,
  TokenModelType,
  UserModelType,
} from "types";

export const SellerUserModel: Model<UserModelType> = model(
  "sellerUsers",
  SellerUserSchema
);

export const BuyerUserModel: Model<UserModelType> = model(
  "buyerUsers",
  BuyerUserSchema
);

export const TokenModel: Model<TokenModelType> = model("tokens", TokenSchema);

export const SellerAccountTokenModel: Model<TokenModelType> = model(
  "sellersAccountTokens",
  TokenSchema
);
export const BuyerAccountTokenModel: Model<TokenModelType> = model(
  "buyersAccountTokens",
  TokenSchema
);
export const ReviewModel: Model<ReviewModelType> = model(
  "reviews",
  ReviewSchema
);
export const ProductModel: Model<ProductModelType> = model(
  "products",
  ProductSchema
);
