import { ProductModel } from "db";
import { handleCatchError } from "response";
import { GQLContext } from "types";
import { MutationResolvers } from "types/graphql";
import { checkAccessToken } from "validateRequest";

export const createProduct: MutationResolvers<GQLContext>["createProduct"] =
  async (parent, args, { req, res }) => {
    try {
      const userId = await checkAccessToken(req);
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
