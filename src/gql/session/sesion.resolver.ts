import { createSession } from "./resolver/create.session.resolver";
import { updateSession } from "./resolver/update.session.resolver";
import { deleteSession } from "./resolver/delete.session.resolver";
import { deleteAllSession } from "./resolver/deleteAll.session.resolver";

export const sessionResolver = {
  Mutation: {
    createSession,
    updateSession,
    deleteSession,
    deleteAllSession,
  },
};
