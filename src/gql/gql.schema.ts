import { resolve } from "path";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

const allSchema = resolve(__dirname + "/gql.schema.gql");
const userSchema = resolve(__dirname + "/user/user.schema.gql");
const sessionSchema = resolve(__dirname + "/session/session.schema.gql");
const productSchema = resolve(__dirname + "/product/product.schema.gql");
const reviewSchema = resolve(__dirname + "/review/review.schema.gql");

const gqlSchema = loadSchemaSync(
  [allSchema, userSchema, sessionSchema, productSchema, reviewSchema],
  {
    loaders: [new GraphQLFileLoader()],
  }
);

export default gqlSchema;
