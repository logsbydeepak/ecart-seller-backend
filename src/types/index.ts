import { Request, Response, ErrorRequestHandler } from "express";
import { Document } from "mongoose";
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

export interface UserModelType extends Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  picture: string;
}

export interface TokenModelType extends Document {
  _id: string;
  owner: string;
  token: string;
}

export interface ReviewModelType extends Document {
  productId: string;
  buyerId: string;
  comment: string;
}

export interface ProductModelType extends Document {
  _id: string;
  owner: string;
  category: "electronics" | "home";
  name: string;
  description: string;
  isPublic: boolean;
}

export interface CreateUserBodyType extends Object, Array<string> {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserBodyType
  extends Object,
    Array<string>,
    CreateUserBodyType {
  currentPassword: string;
  toUpdate: string;
}

export interface BodyDataType extends CreateUserBodyType, UpdateUserBodyType {}
