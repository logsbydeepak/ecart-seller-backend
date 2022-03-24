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
    const { category, isPublic, skip, limit } = args;

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
      const { name, description, isPublic, category } = element;
      newDBProduct.push({
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
