import { ErrorMessageTitle } from "~/types";
import { ErrorResponse as ErrorResponseType } from "~/types/graphql";

export const ErrorObject = (
  messageTitle: ErrorMessageTitle,
  message: string
) => ({
  ErrorObject: {
    messageTitle,
    message,
  },
});

export const ErrorResponse = (
  messageTitle: string,
  message: string
): ErrorResponseType => {
  return {
    __typename: "ErrorResponse",
    title: messageTitle,
    message,
  };
};

export const handleCatchError = (error: any) => {
  if (error.__typename === "ErrorResponse") {
    return error;
  }

  if (error.ErrorObject) {
    return ErrorResponse(
      error.ErrorObject.messageTitle,
      error.ErrorObject.message
    );
  }
  return ErrorResponse("INTERNAL_SERVER", "Something went wrong");
};