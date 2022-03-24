import { validateBody, validateEmpty } from "helper";
import { ProductModel } from "model";
import { ErrorObject, handleCatchError } from "response";
import { GQLContext } from "types";
import { MutationResolvers } from "types/graphql";
import { checkAccessToken } from "validateRequest";

export const updateProduct: MutationResolvers<GQLContext>["updateProduct"] =
  async (parent, args, { req, res }) => {
    try {
      const userId = await checkAccessToken(req);

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
      if (!dbProduct || dbProduct.owner !== userId) {
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
