import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_NAME, CLOUDINARY_SECRET } from "./env.config";

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_NAME,
  api_secret: CLOUDINARY_SECRET,
});

export default cloudinary;
