import * as yup from "yup";
import { InferType } from "yup";

export const validateData = async <T extends yup.AnyObjectSchema>(
  validateSchema: T,
  args: InferType<T>
): Promise<
  | { isError: false; data: T }
  | { isError: true; error: { message: string; path: string } }
> => {
  try {
    const validate = await validateSchema.validate(args);
    return { isError: false, data: validate };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      if (!error.path) {
        throw error;
      }
      return {
        isError: true,
        error: { message: error.message, path: error.path },
      };
    }
    throw error;
  }
};

export const email = yup
  .string()
  .required()
  .email("invalid email")
  .trim()
  .lowercase();

export const password = yup
  .string()
  .required()
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    "invalid password"
  );

export const firstName = yup.string().required().trim();

export const lastName = yup.string().required().trim();
