import { createUser } from "./resolver/create.user.resolver";
import { readUser } from "./resolver/read.user.resolver";
import { updateUser } from "./resolver/update.user.resolver";
import { deleteUser } from "./resolver/delete.user.resolver";

export const userResolver = {
  Query: {
    readUser,
  },
  Mutation: {
    createUser,
    updateUser,
    deleteUser,
  },
};
