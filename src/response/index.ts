import { ErrorResponse as ErrorResponseType } from "types/graphql";
import errorData from "./error.data.json";

export const ErrorObject = (messageTypeCode: string, messageCode: number) => ({
  ErrorObject: {
    messageTypeCode,
    messageCode,
  },
});

export const ErrorResponse = (
  messageTypeCode: string,
  messageCode: number
): ErrorResponseType => {
  const responseData = errorData.find(
    (data: any) => data.messageTypeCode === messageTypeCode
  )!;

  const responseMessage = responseData.response.find(
    (data) => data.messageCode === messageCode
  )!;

  return {
    __typename: "ErrorResponse",
    title: responseData.messageType,
    message: responseMessage.message,
    statusCode: responseMessage.statusCode,
  };
};

export const handleCatchError = (error: any) => {
  if (error.ErrorObject) {
    return ErrorResponse(
      error.ErrorObject.messageTypeCode,
      error.ErrorObject.messageCode
    );
  }
  return ErrorResponse("IS", 10);
};
