import { validateBody, validateEmpty } from "helper";
import { ProductModel } from "model";
import { ErrorObject, ErrorResponse, handleCatchError } from "response";
import { GQLContext } from "types";
import { MutationResolvers } from "types/graphql";
import { checkAccessToken } from "validateRequest";

export const updateProduct: MutationResolvers<GQLContext>["updateProduct"] =
  async (parent, args, { req, res }) => {
    try {
      const userId = await checkAccessToken(req);

      const bodyDate = validateBody(args, 3);
      const toUpdate = validateEmpty(bodyDate.toUpdate, "BP", 18);

      if (
        toUpdate !== "name" &&
        toUpdate !== "description" &&
        toUpdate !== "isPublic" &&
        toUpdate !== "category"
      ) {
        throw ErrorResponse("BP", 37);
      }

      const productId = validateEmpty(args.toUpdate, "BP", 36);

      const dbProduct = await ProductModel.findById(productId);
      if (!dbProduct || dbProduct.owner !== userId) {
        throw ErrorObject("BP", 37);
      }

      // @ts-ignore
      dbProduct[toUpdate] = bodyDate[toUpdate]!;

      await dbProduct.save();

      return {
        __typename: "Product",
        name: dbProduct.name,
        description: dbProduct.description,
        isPublic: dbProduct.isPublic,
        category: dbProduct.category,
      };
    } catch (error: any) {
      return handleCatchError(error);
    }
  };
