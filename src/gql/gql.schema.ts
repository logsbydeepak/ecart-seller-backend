import { join } from "path";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

export const gqlSchema = loadSchemaSync(
  join(__dirname + "./../gql/gql.schema.gql"),
  {
    loaders: [new GraphQLFileLoader()],
  }
);
