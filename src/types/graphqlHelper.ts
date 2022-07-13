import { GQLContext } from "~/config/server.config";
import { Mutation, Query, Resolvers, ResolversTypes } from "./graphql";

export type GQLResolvers = Resolvers<GQLContext>;

export type GQLResponseType =
  | keyof Mutation
  | keyof Query
  | keyof ResolversTypes;

export type GQLResponse<T> = T extends keyof Mutation
  ? Mutation[T]
  : T extends keyof Query
  ? Query[T]
  : T extends keyof ResolversTypes
  ? ResolversTypes[T]
  : never;
