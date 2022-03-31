import { validateEmpty, validateIsNumber } from "helper";
import { handleCatchError } from "response";
import { GQLContext } from "types";
import { QueryResolvers, Review } from "types/graphql";
import { checkAccessToken } from "validateRequest";
import { ReviewModel, SellerUserModel } from "db";
import { ErrorObject } from "response";

export const readReview: QueryResolvers<GQLContext>["readReview"] = async (
  parent,
  args,
  { req, res }
) => {
  try {
    const userId = await checkAccessToken(req);
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
      const dbUser = await SellerUserModel.findById(buyerId);
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
