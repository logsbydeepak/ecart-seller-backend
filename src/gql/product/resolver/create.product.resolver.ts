import { ResolveMutation } from "~/types";
import { ProductModel } from "~/db/model.db";
import { MutationResolvers } from "~/types/graphql";
import { handleCatchError } from "~/helper/response.helper";

const createProduct: ResolveMutation<"createProduct"> = async (
  _,
  args,
  { req, validateAccessTokenMiddleware }
) => {
  try {
    const userId = await validateAccessTokenMiddleware(req);
    const newProduct = new ProductModel({ ...args, owner: userId });

    await newProduct.save();
    return {
      __typename: "Product",
      id: newProduct._id,
      name: newProduct.name,
      description: newProduct.description,
      isPublic: newProduct.isPublic,
      category: newProduct.category,
    };
  } catch (error: any) {
    return handleCatchError(error);
  }
};

export default createProduct;
