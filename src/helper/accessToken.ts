import { Request } from "express";

export const checkAccessToken = (req: Request) => {
  if (!req.cookies.accessToken) {
    return {
      id: null,
      error: {
        __typename: "ErrorResponse",
        title: "AUTH",
        message: "access token missing",
      },
    };
  }

  return { id: "id", error: null };
};
