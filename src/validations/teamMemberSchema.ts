import * as Yup from "yup";

export const teamMemberSchema = Yup.object().shape({
    name: Yup.string()
        .required("Name is required")
        .max(100, "Name cannot exceed 100 characters"),
    phone: Yup.string()
        .required("Phone number is required")
        .matches(/^\d{10}$/, {
            message: "Phone number must be exactly 10 digits",
            excludeEmptyString: true,
        }),

    email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
    role: Yup
        .string()
        .required("Role is required"),
    permissions: Yup.array()
        .min(1, "At least one permission must be selected")
        .of(Yup.string())
});