import { Schema } from "mongoose";
import { TokenModelType } from "types";

const { ObjectId } = Schema.Types;

const TokenSchema = new Schema<TokenModelType>({
  owner: ObjectId,
  refreshToken: { type: String, required: true },
  accessToken: { type: String, required: true },
});

export default TokenSchema;
