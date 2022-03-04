import { resolve } from "path";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

const userSchema = resolve(__dirname + "/user/user.schema.gql");

export const gqlSchema = loadSchemaSync([userSchema], {
  loaders: [new GraphQLFileLoader()],
});
