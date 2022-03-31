import { model, Model, createConnection } from "mongoose";

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
import { DB_URL_MAIN, DB_URL_SELLER } from "config";

export const DB_MAIN = createConnection(DB_URL_MAIN as string);
export const DB_SELLER = createConnection(DB_URL_SELLER as string);

export const SellerUserModel: Model<UserModelType> = DB_MAIN.model(
  "sellerUsers",
  SellerUserSchema
);

export const BuyerUserModel: Model<UserModelType> = model(
  "buyerUsers",
  BuyerUserSchema
);

export const TokenModel: Model<TokenModelType> = DB_SELLER.model(
  "tokens",
  TokenSchema
);

export const SellerAccountTokenModel: Model<TokenModelType> = DB_SELLER.model(
  "sellersAccountTokens",
  TokenSchema
);
export const BuyerAccountTokenModel: Model<TokenModelType> = model(
  "buyersAccountTokens",
  TokenSchema
);

export const ReviewModel: Model<ReviewModelType> = DB_MAIN.model(
  "reviews",
  ReviewSchema
);

export const ProductModel: Model<ProductModelType> = DB_MAIN.model(
  "products",
  ProductSchema
);
