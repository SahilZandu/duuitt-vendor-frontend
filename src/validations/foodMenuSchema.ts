// import * as Yup from "yup";

// export const foodMenuSchema = Yup.object().shape({
//     dish_category_id: Yup.string()
//         .required("Dish category is required"),
//     name: Yup.string()
//         .required("Product Name is required")
//         .max(100, "Product Name cannot exceed 100 characters"),
//     selling_price: Yup.number()
//         .typeError("Selling Price must be a number")
//         .required("Selling Price is required")
//         .min(0, "Selling Price cannot be negative"),
//     description: Yup.string()
//         .required("Description is required")
//         .max(500, "Description cannot exceed 500 characters"),
//     veg_nonveg: Yup.string()
//         .required("Item Type is required"),
//     image: Yup
//         .mixed()
//         .required("Product image is required")
//         .test("fileType", "Unsupported File Format", (value) => {
//             if (!value) return false;
//             const supportedFormats = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
//             return supportedFormats.includes(value.type);
//         }),
//     tag: Yup.string().nullable(),
//     recomended: Yup.mixed(),
// });
