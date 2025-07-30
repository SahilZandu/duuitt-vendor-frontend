import * as Yup from "yup";

export const validateFormData = async <T>(
  schema: Yup.ObjectSchema<any>,
  data: T
): Promise<{ valid: boolean; errors: Partial<Record<keyof T, string>> }> => {
  try {
    await schema.validate(data, { abortEarly: false });
    return { valid: true, errors: {} };
  } catch (err: any) {
    const errors: Partial<Record<keyof T, string>> = {};
    if (err.inner) {
      err.inner.forEach((validationError: any) => {
        errors[validationError.path as keyof T] = validationError.message;
      });
    }
    return { valid: false, errors };
  }
};
