import { validateEmpty } from "helper";
import { ProductModel } from "db";
import { ErrorObject, handleCatchError } from "response";
import { GQLContext } from "types";
import { MutationResolvers } from "types/graphql";
import { checkAccessToken } from "validateRequest";

export const deleteProduct: MutationResolvers<GQLContext>["deleteProduct"] =
  async (parent, args, { req, res }) => {
    try {
      const { userId } = await checkAccessToken(req);
      const productId = validateEmpty(
        args.id,
        "BODY_PARSE",
        "product id is required"
      );

      const dbProduct = await ProductModel.findById(productId);
      if (!dbProduct) {
        throw ErrorObject("BODY_PARSE", "product do not exist");
      }

      if (dbProduct.owner !== userId) {
        throw ErrorObject("BODY_PARSE", "product do not exist");
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
