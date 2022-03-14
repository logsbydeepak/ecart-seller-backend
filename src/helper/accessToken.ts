import { Request } from "express";

export const checkAccessToken = (req: Request) => {
  if (!req.cookies.accessToken) {
    throw {
      __typename: "ErrorResponse",
      title: "AUTH",
      message: "access token missing",
    };
  }

  return { id: "id" };
};
