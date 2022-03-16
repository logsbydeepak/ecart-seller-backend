// import { checkAccessToken } from "helper/token";
import { GQLContext } from "types";
import { QueryResolvers } from "types/graphql";

export const readUser: QueryResolvers<GQLContext>["readUser"] = (
  _,
  __,
  { req, res }
) => {
  try {
    // const id = checkAccessToken(req);
    return { name: "", email: "" };
  } catch (error: any) {
    if (error.__typename === "ErrorResponse") {
      return error;
    }

    return {
      __typename: "ErrorResponse",
      title: "INTERNAL_SERVER",
      message: "Something went wrong",
    };
  }

  return { name: "", email: "" };
};
