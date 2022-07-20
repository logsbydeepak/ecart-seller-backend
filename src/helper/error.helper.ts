import { TokenError } from "~/types/graphql";

export const TokenUserDoNotExistError: TokenError = {
  __typename: "TokenError",
  type: "TokenUserDoNotExistError",
  message: "user do not exist",
};
