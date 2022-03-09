import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";

export const validateEmpty = (rawData: string, message: string): string => {
  if (!rawData) {
    throw {
      __typename: "ErrorResponse",
      title: "INVALID_DATA",
      message: message,
    };
  }
  return rawData.trim();
};

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

export const validatePassword = (password: string): string => {
  if (!password) {
    throw {
      __typename: "ErrorResponse",
      title: "INVALID_DATA",
      message: "password is required",
    };
  }

  const formatedPassword = password.trim();
  if (!isStrongPassword(formatedPassword)) {
    throw {
      __typename: "ErrorResponse",
      title: "INVALID_DATA",
      message:
        "password must be a minimum of 8 characters long and have an of 1 lower case, upper case, symbol, number",
    };
  }

  return formatedPassword;
};
