import isEmail from "validator/lib/isEmail";

export const validateBody = (bodyData: any, bodyDataCount: number) => {
  if (bodyData.length >= 0) {
    throw {
      __typename: "ErrorResponse",
      title: "INVALID_DATA",
      message: "Invalid body data",
    };
  }

  const bodyDataLength: number = Object.keys(bodyData).length;
  if (bodyDataLength !== bodyDataCount) {
    throw {
      __typename: "ErrorResponse",
      title: "INVALID_DATA",
      message: "Body data missing",
    };
  }

  return bodyData;
};

export const validateEmail = (email: string) => {
  if (!email) {
    throw {
      __typename: "ErrorResponse",
      title: "INVALID_DATA",
      message: "Email is required",
    };
  }

  const formatedEmail = email.trim().toLowerCase();
  if (!isEmail(formatedEmail)) {
    throw {
      __typename: "ErrorResponse",
      title: "INVALID_DATA",
      message: "Invalid email",
    };
  }

  return formatedEmail;
};
