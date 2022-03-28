import { ErrorObject } from "response";
import { UserType } from "types";

export const shouldBeSeller = (userType: UserType) => {
  if (userType === "SELLER") {
    return userType;
  }
  throw ErrorObject(
    "AUTHENTICATION",
    "seller is not allowed to access this resource"
  );
};

export const shouldBeBuyer = (userType: UserType) => {
  if (userType === "BUYER") {
    return userType;
  }
  throw ErrorObject(
    "AUTHENTICATION",
    "buyer is not allowed to access this resource"
  );
};
