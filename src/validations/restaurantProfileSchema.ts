import * as Yup from "yup";

export const restaurantProfileSchema = Yup.object({
    name: Yup.string()
        .required("Restaurant name is required")
        .max(100, "Name must be at most 100 characters"),

    about: Yup.string()
        .required("About is required")
        .max(5000, "About must be at most 5000 characters"),

    address: Yup.string().required("Restaurant address is required")
     .max(250, "Restaurant address must be at most 250 characters"),

    phone: Yup.string()
        .required("Phone number is required")
        .test("only-numbers", "Only numbers are allowed", (value) =>
            value ? /^[0-9]+$/.test(value) : true
        )
        .test("exact-length", "Phone number must be exactly 10 digits", (value) =>
            value ? value.length === 10 : true
        ),

    email: Yup.string()
        .required("Email is required")
        .email("Invalid email"),

    date_of_founding: Yup.string()
        .required("Date of founding is required"),

    veg_non_veg: Yup.string()
        .required("Please select item type"),

    minimum_order_value: Yup.number()
        .transform((value, originalValue) => originalValue === "" ? undefined : value)
        .typeError("Minimum order value must be a number")
        .integer("Must be an integer")
        .min(0, "Minimum order value cannot be negative")
        .required("Minimum order value is required"),

    minimum_order_preparation_time: Yup.number()
        .transform((value, originalValue) => originalValue === "" ? undefined : value)
        .typeError("Preparation time must be a number")
        .integer("Must be an integer")
        .min(0, "Preparation time cannot be negative")
        .required("Preparation time is required"),
});
