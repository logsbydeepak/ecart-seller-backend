import * as yup from "yup";
import { InferType } from "yup";

export const validateArgs = async <T extends yup.AnyObjectSchema>(
  validateSchema: T,
  args: InferType<T>
) => {
  try {
    const validate = await validateSchema.validate(args);
    return { argsData: validate, argsError: null };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      if (!error.path) {
        throw error;
      }

      return {
        argsData: null,
        argsError: { message: error.message, field: error.path },
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
