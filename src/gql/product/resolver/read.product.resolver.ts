import { validateCategory, validateIsNumber, validateIsPublic } from "helper";
import { ProductModel } from "model";
import { ErrorObject, handleCatchError } from "response";
import { GQLContext } from "types";
import { QueryResolvers, Product } from "types/graphql";
import { checkAccessToken } from "validateRequest";

export const readProduct: QueryResolvers<GQLContext>["readProduct"] = async (
  parent,
  args,
  { req, res }
) => {
  try {
    const userId = await checkAccessToken(req);
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
