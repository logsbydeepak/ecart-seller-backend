import { JwtPayload, sign, verify } from "jsonwebtoken";

import { generateEncryption } from "./security.helper";
import { TOKEN_SECRET } from "~/config/env.config";
import { ObjectId } from "mongoose";

export const tokenGenerator = (id: ObjectId) =>
  generateEncryption(
    sign({ id, type: "SELLER" }, TOKEN_SECRET as string, { expiresIn: "90d" })
  );

export const tokenValidator = (
  token: string
): JwtPayload | null | "TokenExpiredError" => {
  try {
    return verify(token, TOKEN_SECRET as string) as JwtPayload;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return "TokenExpiredError";
    }
    return null;
  }
};
