import { GQLContext } from "~/types";
import { ProductModel } from "~/db/model.db";
import { MutationResolvers } from "~/types/graphql";
import { validateBody, validateEmpty } from "~/helper/validator.helper";
import { ErrorObject, handleCatchError } from "~/helper/response.helper";

const updateProduct: MutationResolvers<GQLContext>["updateProduct"] = async (
  _,
  args,
  { req, validateAccessTokenMiddleware }
) => {
  try {
    const { userId } = await validateAccessTokenMiddleware(req);

    const bodyDate = validateBody(args, 3);
    const toUpdate = validateEmpty(
      bodyDate.toUpdate,
      "BODY_PARSE",
      "toUpdate is required"
    );

    if (
      toUpdate !== "name" &&
      toUpdate !== "description" &&
      toUpdate !== "isPublic" &&
      toUpdate !== "category"
    ) {
      throw ErrorObject("BODY_PARSE", "invalid toUpdate");
    }

    const productId = validateEmpty(
      args.toUpdate,
      "BODY_PARSE",
      "product id is required"
    );

    const dbProduct = await ProductModel.findById(productId);
    if (!dbProduct) {
      throw ErrorObject("BODY_PARSE", "invalid product id");
    }

    if (dbProduct.owner !== userId) {
      throw ErrorObject("BODY_PARSE", "invalid product id");
    }

    // @ts-ignore
    dbProduct[toUpdate] = bodyDate[toUpdate]!;

    await dbProduct.save();

    return {
      __typename: "Product",
      id: dbProduct._id,
      name: dbProduct.name,
      description: dbProduct.description,
      isPublic: dbProduct.isPublic,
      category: dbProduct.category,
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};

export default updateProduct;
