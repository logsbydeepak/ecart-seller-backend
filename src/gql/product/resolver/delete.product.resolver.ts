import { validateEmpty } from "helper";
import { ProductModel } from "model";
import { ErrorObject, handleCatchError } from "response";
import { GQLContext } from "types";
import { MutationResolvers } from "types/graphql";
import { checkAccessToken } from "validateRequest";

export const deleteProduct: MutationResolvers<GQLContext>["deleteProduct"] =
  async (parent, args, { req, res }) => {
    try {
      const userId = await checkAccessToken(req);
      const productId = validateEmpty(args.id, "BP", 36);

      const dbProduct = await ProductModel.findById(productId);
      if (!dbProduct || dbProduct.owner !== userId) {
        throw ErrorObject("BP", 37);
      }

      await ProductModel.findByIdAndRemove(productId);

      return {
        __typename: "SuccessResponse",
        message: "product removed",
      };
    } catch (error: any) {
      return handleCatchError(error);
    }
  };
