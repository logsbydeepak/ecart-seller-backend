import { resolve } from "path";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

const allSchema = resolve(__dirname + "/gql.schema.gql");
const userSchema = resolve(__dirname + "/user/user.schema.gql");
const sessionSchema = resolve(__dirname + "/session/session.schema.gql");

export const gqlSchema = loadSchemaSync(
  [allSchema, userSchema, sessionSchema],
  {
    loaders: [new GraphQLFileLoader()],
  }
);
