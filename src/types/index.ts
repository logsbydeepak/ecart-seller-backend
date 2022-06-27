import { Request, Response, ErrorRequestHandler } from "express";
import { Document } from "mongoose";
import { Mutation, Query, Resolvers } from "./graphql";

export type GQLContext = {
  req: Request;
  res: Response;
  validateTokenMiddleware: (
    req: Request
  ) => Promise<{ userId: string; token: string }>;
  validatePasswordMiddleware: <T>(
    password: string,
    userId: string,
    passwordEmptyErrorObj: T,
    passwordInvalidErrorObj: T
  ) => Promise<any>;
};

export type GQLResolvers = Resolvers<GQLContext>;

export type GQLResponseType = keyof Mutation | keyof Query;
export type GQLResponse<T> = T extends keyof Mutation
  ? Mutation[T]
  : T extends keyof Query
  ? Query[T]
  : never;

export interface UserModelType extends Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
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

export interface ErrorObjectType {
  ErrorObject: {
    messageTypeCode: string;
    messageCode: number;
  };
}

export interface MyErrorRequestHandler
  extends ErrorRequestHandler,
    ErrorObjectType {}

export type ErrorMessageTitle =
  | "INTERNAL_SERVER"
  | "BODY_PARSE"
  | "TOKEN_PARSE"
  | "AUTHENTICATION";
