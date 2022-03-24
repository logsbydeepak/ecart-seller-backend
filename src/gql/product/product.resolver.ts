import { createProduct } from "./resolver/create.product.resolver";
import { updateProduct } from "./resolver/update.product.resolver";
import { readProduct } from "./resolver/read.product.resolver";
import { deleteProduct } from "./resolver/delete.product.resolver";

export const productQueryResolver = { readProduct };

export const productMutationResolver = {
  createProduct,
  updateProduct,
  deleteProduct,
};
