import { createProduct } from "./resolver/create.product.resolver";
import { updateProduct } from "./resolver/update.product.resolver";

export const productQueryResolver = {};

export const productMutationResolver = {
  createProduct,
  updateProduct,
};
