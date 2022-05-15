import { GQLContext } from "~/types";
import { ReviewModel, UserModel } from "~/db/model.db";
import { QueryResolvers, Review } from "~/types/graphql";
import { ErrorObject, handleCatchError } from "~/helper/response.helper";
import { validateEmpty, validateIsNumber } from "~/helper/validator.helper";

export const readReview: QueryResolvers<GQLContext>["readReview"] = async (
  _,
  args,
  { req, validateAccessTokenMiddleware }
) => {
  try {
    const userId = await validateAccessTokenMiddleware(req);
    const skip = validateIsNumber(args.skip, "skip");
    const limit = validateIsNumber(args.limit, "limit");
    const productId = validateEmpty(
      args.productId,
      "BODY_PARSE",
      "productId is required"
    );

    const dbReview = await ReviewModel.find({
      owner: userId,
    });

    if (!dbReview) {
      throw ErrorObject("BODY_PARSE", "invalid productId");
    }

    const newDBProduct: Review[] = [];

    dbReview.forEach(async (element) => {
      const { comment, buyerId } = element;
      const dbUser = await UserModel.findById(buyerId);
      if (!dbUser) {
        throw {};
      }

      newDBProduct.push({
        comment,
        name: dbUser.name,
        __typename: "Review",
      });
    });

    return newDBProduct;
  } catch (error: any) {
    return [handleCatchError(error)];
  }
};
