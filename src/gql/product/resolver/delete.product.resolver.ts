import { ResolveMutation } from "~/types";
import { ProductModel } from "~/db/model.db";
import { validateEmpty } from "~/helper/validator.helper";
import { ErrorObject, handleCatchError } from "~/helper/response.helper";

const deleteProduct: ResolveMutation<"deleteProduct"> = async (
  _,
  args,
  { req, validateAccessTokenMiddleware }
) => {
  try {
    const { userId } = await validateAccessTokenMiddleware(req);
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

export default deleteProduct;
