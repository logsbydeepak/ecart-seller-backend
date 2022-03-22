import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";

import { ErrorObject } from "response";
import isBoolean from "validator/lib/isBoolean";

const category = ["electronics", "home"];

export const validateBody = (bodyData: any, bodyDataCount: number) => {
  if (bodyData.length >= 0) {
    throw ErrorObject("BP", 10);
  }

  const bodyDataLength: number = Object.keys(bodyData).length;
  if (bodyDataLength !== bodyDataCount) {
    throw ErrorObject("BP", 11);
  }

  return bodyData;
};

export const validateEmpty = (
  rawData: string,
  messageTypeCode: string,
  messageCode: number
): string => {
  if (!rawData) {
    throw ErrorObject(messageTypeCode, messageCode);
  }
  return rawData.trim();
};

export const validateEmail = (email: string): string => {
  if (!email) {
    throw ErrorObject("BP", 14);
  }

  const formatedEmail = email.trim().toLowerCase();
  if (!isEmail(formatedEmail)) {
    throw ErrorObject("BP", 15);
  }

  return formatedEmail;
};

export const validatePassword = (password: string): string => {
  if (!password) {
    throw ErrorObject("BP", 16);
  }

  const formatedPassword = password.trim();
  if (!isStrongPassword(formatedPassword)) {
    throw ErrorObject("BP", 17);
  }

  return formatedPassword;
};

export const validateTask = (rawData: boolean): boolean => {
  if (typeof rawData === "boolean") {
    return rawData;
  }

  if (!rawData) {
    throw ErrorObject("BP", 23);
  }

  throw ErrorObject("BP", 24);
};

export const validateCatergory = (rawCategory: string): string => {
  if (!rawCategory) {
    throw ErrorObject("BP", 28);
  }

  const modeCatergory = rawCategory.trim().toLocaleLowerCase();
  const validCategory = category.find((value) => value === modeCatergory);

  if (!validCategory) {
    throw ErrorObject("BP", 29);
  }

  return validCategory;
};

export const validateIsPublic = (rawIsPublic: boolean): boolean => {
  if (!rawIsPublic) {
    throw ErrorObject("BP", 30);
  }

  if (typeof rawIsPublic !== "boolean") {
    throw ErrorObject("BP", 30);
  }

  return rawIsPublic;
};

export const validateProductName = (rawProductName: string): string => {
  if (!rawProductName) {
    throw ErrorObject("BP", 32);
  }

  const modProductName = rawProductName.trim();
  if (modProductName.length >= 10) {
    throw ErrorObject("BP", 33);
  }

  return modProductName;
};

export const validateProductDescription = (
  rawProductDescription: string
): string => {
  if (!rawProductDescription) {
    throw ErrorObject("BP", 34);
  }

  const modProductDescription = rawProductDescription.trim();
  if (modProductDescription.length >= 20) {
    throw ErrorObject("BP", 35);
  }

  return modProductDescription;
};
