import isEmail from "validator/lib/isEmail";

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
