import {
  validateCategory,
  validateIsNumber,
  validateIsPublic,
} from "~/helper/validator.helper";

import { ResolveQuery } from "~/types";
import { Product } from "~/types/graphql";
import { ProductModel } from "~/db/model.db";
import { ErrorObject, handleCatchError } from "~/helper/response.helper";

const readProduct: ResolveQuery<"readProduct"> = async (
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

export default readProduct;
