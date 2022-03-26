import { handleCatchError } from "response";
import { GQLContext } from "types";
import { QueryResolvers } from "types/graphql";

export const readReview: QueryResolvers<GQLContext>["readProduct"] =
  async () => {
    try {
      return [];
    } catch (error: any) {
      return [handleCatchError(error)];
    }
  };
