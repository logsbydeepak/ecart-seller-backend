import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";

import { ErrorObject } from "response";

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
