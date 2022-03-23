import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";

import { ThrowErrorObject } from "response";
import { ErrorMessageTitle } from "types";

const productCategoryList = ["electronics", "home"];

export const validateBody = (bodyData: any, bodyDataCount: number) => {
  if (bodyData.length >= 0) {
    ThrowErrorObject("BODY_PARSE", "invalid data");
  }

  const bodyDataLength: number = Object.keys(bodyData).length;
  if (bodyDataLength !== bodyDataCount) {
    ThrowErrorObject("BODY_PARSE", "invalid data");
  }

  return bodyData;
};

export const validateEmpty = (
  rawData: string,
  messageTitle: ErrorMessageTitle,
  message: string
): string => {
  if (!rawData) {
    ThrowErrorObject(messageTitle, message);
  }

  return rawData.trim();
};

export const validateEmail = (email: string): string => {
  if (!email) {
    ThrowErrorObject("BODY_PARSE", "email is required");
  }

  const formattedEmail = email.trim().toLowerCase();
  if (!isEmail(formattedEmail)) {
    ThrowErrorObject("BODY_PARSE", "invalid email");
  }

  return formattedEmail;
};

export const validatePassword = (password: string): string => {
  if (!password) {
    ThrowErrorObject("BODY_PARSE", "password is required");
  }

  const formattedPassword = password.trim();
  if (!isStrongPassword(formattedPassword)) {
    ThrowErrorObject("BODY_PARSE", "invalid password");
  }

  return formattedPassword;
};

export const validateCategory = (rawCategory: string): string => {
  if (!rawCategory) {
    ThrowErrorObject("BODY_PARSE", "category is required");
  }

  const formattedCategory = rawCategory.trim().toLocaleLowerCase();
  const isValidCategory = productCategoryList.find(
    (value) => value === formattedCategory
  );

  if (!isValidCategory) {
    ThrowErrorObject("BODY_PARSE", "invalid category");
  }

  return formattedCategory;
};

export const validateIsPublic = (rawIsPublic: boolean): boolean => {
  if (!rawIsPublic) {
    ThrowErrorObject("BODY_PARSE", "is public is required");
  }

  if (typeof rawIsPublic !== "boolean") {
    ThrowErrorObject("BODY_PARSE", "invalid is public");
  }

  return rawIsPublic;
};

export const validateProductName = (rawProductName: string): string => {
  if (!rawProductName) {
    ThrowErrorObject("BODY_PARSE", "product name is required");
  }

  const formattedProductName = rawProductName.trim();
  if (formattedProductName.length >= 10) {
    ThrowErrorObject("BODY_PARSE", "invalid product name");
  }

  return formattedProductName;
};

export const validateProductDescription = (
  rawProductDescription: string
): string => {
  if (!rawProductDescription) {
    ThrowErrorObject("BODY_PARSE", "product description is required");
  }

  const formattedProductDescription = rawProductDescription.trim();
  if (formattedProductDescription.length >= 20) {
    ThrowErrorObject("BODY_PARSE", "invalid product description");
  }

  return formattedProductDescription;
};
