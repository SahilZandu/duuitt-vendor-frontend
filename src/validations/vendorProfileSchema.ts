import * as Yup from "yup";

export const vendorProfileSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
});
