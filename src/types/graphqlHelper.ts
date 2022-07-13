import { Request, Response } from "express";
import { Mutation, Query, Resolvers, ResolversTypes } from "./graphql";

export type GQLContext = {
  req: Request;
  res: Response;
  validateTokenMiddleware: (
    req: Request
  ) => Promise<{ userId: string; token: string }>;
  validatePasswordMiddleware: <T extends GQLResponseType>(
    password: string,
    userId: string,
    passwordEmptyErrorObj: GQLResponse<T>,
    passwordInvalidErrorObj: GQLResponse<T>
  ) => Promise<any>;
};

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
