import * as Yup from "yup";

export const bankSchema = Yup.object().shape({
  bank_name: Yup.string()
    .trim()
    .required("Bank name is required")
    .max(100, "Bank name cannot exceed 100 characters"),

  account_number: Yup.string()
    .trim()
    .required("Account number is required")
    .test(
      "is-numeric",
      "Only numbers are allowed",
      (value) => !value || /^[0-9]+$/.test(value)
    ),

  ifsc_code: Yup.string()
    .trim()
    .required("IFSC Code is required")
    .test(
      "is-valid-ifsc",
      "Invalid IFSC Code",
      (value) => !value || /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)
    ),
});


export const fssaiSchema = Yup.object().shape({
  account_number: Yup.string()
    .required("FSSAI number is required"),
  expiration_date: Yup.date()
    .required("Expiry date is required"),
  image: Yup.mixed().required("FSSAI document is required"),
});

export const gstSchema = Yup.object().shape({
  gstn_number: Yup.string()
    .required("GST number is required")
    .test("is-valid-gstn", "Invalid GST number", (value) => {
      if (!value) return true; // if empty, let required() handle it
      return /^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})$/.test(value);
    }),
  expiration_date: Yup.date().required("Expiration date is required"),
  image: Yup.mixed().required("GST document is required"),
});

export const panSchema = Yup.object().shape({
  pan_number: Yup.string()
    .required("PAN number is required")
    .test("is-valid-pan", "Invalid PAN number", (value) => {
      if (!value) return true; // let required() handle empty
      return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
    }),
  image: Yup.mixed().required("PAN document is required"),
});
