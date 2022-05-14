import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";

import { ErrorObject } from "response";
import { ErrorMessageTitle } from "types";

const productCategoryList = ["electronics", "home"];

export const validateBody = (bodyData: any, bodyDataCount: number) => {
  if (bodyData.length >= 0) {
    throw ErrorObject("BODY_PARSE", "invalid data");
  }

  const bodyDataLength: number = Object.keys(bodyData).length;
  if (bodyDataLength !== bodyDataCount) {
    throw ErrorObject("BODY_PARSE", "invalid data");
  }

  return bodyData;
};

export const validateEmpty = (
  rawData: string | string[] | undefined,
  messageTitle: ErrorMessageTitle,
  message: string
): string => {
  if (!rawData || typeof rawData === "object") {
    throw ErrorObject(messageTitle, message);
  }

  return rawData.trim();
};

export const validateEmail = (email: string): string => {
  if (!email) {
    throw ErrorObject("BODY_PARSE", "email is required");
  }

  const formattedEmail = email.trim().toLowerCase();
  if (!isEmail(formattedEmail)) {
    throw ErrorObject("BODY_PARSE", "invalid email");
  }

  return formattedEmail;
};

export const validatePassword = (password: string): string => {
  if (!password) {
    throw ErrorObject("BODY_PARSE", "password is required");
  }

  const formattedPassword = password.trim();
  if (!isStrongPassword(formattedPassword)) {
    throw ErrorObject("BODY_PARSE", "invalid password");
  }

  return formattedPassword;
};

export const validateCategory = (rawCategory: string): string => {
  if (!rawCategory) {
    throw ErrorObject("BODY_PARSE", "category is required");
  }

  const formattedCategory = rawCategory.trim().toLocaleLowerCase();
  const isValidCategory = productCategoryList.find(
    (value) => value === formattedCategory
  );

  if (!isValidCategory) {
    throw ErrorObject("BODY_PARSE", "invalid category");
  }

  return formattedCategory;
};

export const validateIsPublic = (rawIsPublic: boolean): boolean => {
  if (rawIsPublic.toString().length === 0) {
    throw ErrorObject("BODY_PARSE", "isPublic is required");
  }

  if (typeof rawIsPublic !== "boolean") {
    throw ErrorObject("BODY_PARSE", "invalid isPublic");
  }

  return rawIsPublic;
};

export const validateProductName = (rawProductName: string): string => {
  if (!rawProductName) {
    throw ErrorObject("BODY_PARSE", "product name is required");
  }

  const formattedProductName = rawProductName.trim();
  if (formattedProductName.length <= 10) {
    throw ErrorObject("BODY_PARSE", "invalid product name");
  }

  return formattedProductName;
};

export const validateProductDescription = (
  rawProductDescription: string
): string => {
  if (!rawProductDescription) {
    throw ErrorObject("BODY_PARSE", "product description is required");
  }

  const formattedProductDescription = rawProductDescription.trim();
  if (formattedProductDescription.length <= 20) {
    throw ErrorObject("BODY_PARSE", "invalid product description");
  }

  return formattedProductDescription;
};

export const validateIsNumber = (
  rawIsNumber: number,
  value: string
): number => {
  if (rawIsNumber.toString().length === 0) {
    throw ErrorObject("BODY_PARSE", `${value} is required`);
  }

  if (typeof rawIsNumber !== "boolean") {
    throw ErrorObject("BODY_PARSE", `invalid ${value}`);
  }

  return rawIsNumber;
};
