import {
  validateCategory,
  validateIsNumber,
  validateIsPublic,
} from "~/helper/validator.helper";

import { GQLContext } from "~/types";
import { ProductModel } from "~/db/model.db";
import { Product, QueryResolvers } from "~/types/graphql";
import { ErrorObject, handleCatchError } from "~/helper/response.helper";

export const readProduct: QueryResolvers<GQLContext>["readProduct"] = async (
  _,
  args,
  { req, validateAccessTokenMiddleware }
) => {
  try {
    const userId = await validateAccessTokenMiddleware(req);
    const category = validateCategory(args.category);
    const isPublic = validateIsPublic(args.isPublic);
    const skip = validateIsNumber(args.skip, "skip");
    const limit = validateIsNumber(args.limit, "limit");

    const dbProduct = await ProductModel.find({
      owner: userId,
      category,
      isPublic,
    })
      .sort("-updatedAt")
      .skip(skip)
      .limit(limit);

    if (!dbProduct) {
      throw ErrorObject("BODY_PARSE", "product not found");
    }
    const newDBProduct: Product[] = [];

    dbProduct.forEach((element) => {
      const { name, description, isPublic, category, _id } = element;
      newDBProduct.push({
        id: _id,
        name,
        description,
        isPublic,
        category,
        __typename: "Product",
      });
    });

    return newDBProduct;
  } catch (error: any) {
    return [handleCatchError(error)];
  }
};
