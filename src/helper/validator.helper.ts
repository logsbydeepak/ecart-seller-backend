import { GQLResponse, GQLResponseType } from "~/types/graphqlHelper";

export const validateEmpty = (rawData: any): null | string => {
  if (!rawData) {
    return null;
  }

  return rawData.trim().toString();
};
