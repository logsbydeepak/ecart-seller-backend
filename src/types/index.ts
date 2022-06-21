import { Request, Response } from "express";
import { ErrorRequestHandler } from "express";
import { Document } from "mongoose";
import { Resolvers } from "./graphql";

export type GQLContext = {
  req: Request;
  res: Response;
  validateTokenMiddleware: (
    req: Request
  ) => Promise<{ userId: string; accessToken: string }>;
  validatePasswordMiddleware: (
    password: string,
    userId: string
  ) => Promise<any>;
};

export type GQLResolvers = Resolvers<GQLContext>;

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
