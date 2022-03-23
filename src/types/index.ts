import { Request, Response } from "express";
import { ErrorRequestHandler } from "express";
import { Document } from "mongoose";

export type GQLContext = {
  req: Request;
  res: Response;
};

export interface UserModelType extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
}

export interface TokenModelType extends Document {
  _id: string;
  owner: string;
  accessToken: string;
  refreshToken: string;
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
  | "AUTHENTICATION"
  | "QUERY_PARSE";
