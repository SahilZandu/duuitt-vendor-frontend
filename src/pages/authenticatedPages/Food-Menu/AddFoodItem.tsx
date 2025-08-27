import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/apiInstance";
import PageTitle from "../../../components/Ui/PageTitle";
import Input from "../../../components/Ui/Input";
import Dropdown from "../../../components/Ui/Dropdown";
import RadioButton from "../../../components/Ui/RadioButton";
import CheckBox from "../../../components/Ui/CheckBox";
import Button from "../../../components/Ui/Button";
// import VariantsSection from "./VariantsSection";
// import AddonsSection from "./AddonsSection";
import MenuIcon from "../../../lib/MenuIcon";
import { toast } from "react-toastify";
import { validateFormData } from "../../../utils/validateForm";
import { foodMenuSchema } from "../../../validations/foodMenuSchema";

interface AddonValue {
    id: number;
    name: string;
    price?: string;
}

interface AddonGroup {
    id: number;
    groupName: string;
    group: string;
    priceable: boolean;
    maxSelectionLimit: string;
    values: AddonValue[];
    is_price_related?: boolean;    // optional, if sometimes missing
    max_selection?: number;
    addon: AddonValue[];
}
interface VariantValue {
    id: number;
    value: string;
}

interface Variant {
    id: number;
    group: string;
    variant: VariantValue[];
}

interface ProductData {
    name: string;
    product_name?: string;
    description: string;
    selling_price: string;
    dish_category_id?: string;
    base_price?: string;
    veg_nonveg?: string;
    status?: boolean;
    in_stock?: boolean;
    recomended?: string[];
    image?: File | null;
    vendor_id?: string;
    restaurant_id?: string;
    title?: string;
    product_timing?: 'full_time' | 'partial_time';
    default_quantity?: number;
    tag?: string;
}

const AddFoodItem = () => {
    const [dishCategories, setDishCategories] = useState<any[]>([]);
    const dishOptions = dishCategories && dishCategories?.length > 0 && dishCategories?.map((option) => ({
        label: option?.name,
        value: option?.name,
    })) || [];
    const [variants, setVariants] = useState<Variant[]>([]);
    // console.log("variants-----", variants);
    const variantsSectionRef = useRef<any>(null);

    const [addons, setAddons] = useState<AddonGroup[]>([]);
    console.log("addons-----", addons);
    const isAddonSectionOpen = addons?.length > 0;

    const [generatedCombinations, setGeneratedCombinations] = useState<any[]>([]);
    console.log("generatedCombinations in parent----", generatedCombinations);

    const [productData, setProductData] = useState<ProductData>({
        dish_category_id: "",
        name: "",
        product_name: "",
        selling_price: "",
        description: "",
        veg_nonveg: "",
        recomended: [] as string[],
        tag: "",
        image: null,
    });

    console.log("productData----------", productData);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance("get", "/dish-category/all");
                setDishCategories(response.data.data || []);
            } catch (error) {
                console.error("Error fetching dish categories:", error);
            }
        };

        fetchCategories();
    }, []);


    const navigate = useNavigate();

    const handleCombinationsChange = (combinations: any[]) => {
        setGeneratedCombinations(combinations);
    };
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.currentTarget;
        const checked = (e.currentTarget as HTMLInputElement).checked;

        setProductData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProductData(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
            setErrors(prev => ({ ...prev, image: "" }));
        }
    };
    const handleRecommendedChange = (selected: string[]) => {
        setProductData(prev => ({
            ...prev,
            recomended: selected.includes("recomended") ? ["recomended"] : [],
        }));
    };

    const restaurant_id = localStorage.getItem("restaurant_id");
    const [errors, setErrors] = useState<Record<string, string>>({});
    console.log({ errors });

    const validateAddons = (addons: AddonGroup[]) => {
        const errors: Record<
            number,
            {
                group?: string;
                max_selection?: string;
                addon?: Record<number, { name?: string; price?: string }>;
            }
        > = {};

        addons.forEach(group => {
            const groupErr: {
                group?: string;
                max_selection?: string;
                addon?: Record<number, { name?: string; price?: string }>;
            } = {};

            // Validate group title
            if (!group.group.trim()) {
                groupErr.group = "Group title is required";
            }

            // Validate addons
            group.addon.forEach((v: any) => {
                if (!groupErr.addon) groupErr.addon = {};

                if (!v.name.trim()) {
                    groupErr.addon[v.id] = {
                        ...(groupErr.addon[v.id] || {}),
                        name: "Addon name is required"
                    };
                }

                if (group.is_price_related && (!v.price || Number(v.price) <= 0)) {
                    groupErr.addon[v.id] = {
                        ...(groupErr.addon[v.id] || {}),
                        price: "Selling price is required and must be > 0"
                    };
                }
            });

            // Validate max_selection
            if (
                !group.max_selection ||
                Number(group.max_selection) < 1 ||
                Number(group.max_selection) > group.addon.length
            ) {
                const max = group.addon.length;
                if (max === 1) {
                    groupErr.max_selection = `Max selection must be 1`;
                } else {
                    groupErr.max_selection = `Max selection must be between 1 and ${max}`;
                }
            }

            // Save group errors if any
            if (
                groupErr.group ||
                groupErr.max_selection ||
                (groupErr.addon && Object.keys(groupErr.addon).length > 0)
            ) {
                errors[group.id] = groupErr;
            }
        });

        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { valid, errors: mainErrors } = await validateFormData(foodMenuSchema, productData);

        let validVariants = true;
        if (variantsSectionRef.current) {
            validVariants = variantsSectionRef.current.validateVariants();
        }

        const addonErrors = validateAddons(addons);

        if (!valid || !validVariants || Object.keys(addonErrors).length > 0) {
            setErrors({
                ...mainErrors,
                addons: addonErrors
            });
            return;
        }

        setErrors({});

        try {
            const formData = new FormData();

            // Append basic product data
            Object.entries(productData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    if (Array.isArray(value)) {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value as any);
                    }
                }
            });
            formData.append("restaurant_id", restaurant_id ?? "");
            // Append variants
            formData.append("variants", JSON.stringify(variants));
            const productType = variants?.length > 0 ? "variable" : "simple";
            formData.append("product_type", productType);
            formData.append("base_price", productData?.selling_price);
            // Append addons
            formData.append("addon", JSON.stringify(addons))
            formData.append("status", "true");
            formData.append("in_stock", "true");
            //  formData.append("tag", "Spicy");
            formData.append("product_timing", "full_time");
            formData.append("combinations", JSON.stringify(generatedCombinations))
            for (const [key, value] of formData.entries()) {
                console.log(key, value);
            }
            // API call
            const response = await axiosInstance("post", "/food-item", formData);
            console.log("response", response);

            // toast.success("Product added successfully");
            // navigate("/food-menu");
        } catch (error) {
            console.error("Error saving product:", error);
            toast.error("Failed to add product");
        }
    };

    return (
        <div className="bg-white px-4 py-6 md:px-8">
            <button
                onClick={() => navigate('/food-menu')}
                className="cursor-pointer inline-flex items-center text-base px-3 py-1 bg-gray-200 rounded-lg mb-2"
            >
                <span className="icon mr-2 text-lg">←</span>
                Back
            </button>
            <form onSubmit={handleSubmit}>
                <PageTitle title="Add Product" align="left" />
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="col-span-1 md:col-span-2">
                        <label className="block mb-2 font-medium">Product Image</label>

                        <div className="relative w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                            {/* Image preview */}
                            {imagePreview ? (
                                <>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Edit button */}
                                    <label className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full shadow cursor-pointer">
                                        <MenuIcon name="edit" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </>
                            ) : (
                                // Add photo placeholder
                                <label className="flex flex-col items-center cursor-pointer text-gray-500">
                                    <MenuIcon name="camera" className="text-3xl mb-1" />
                                    <span className="text-sm">Add Photo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                        {errors && <p className="text-sm text-red-500 mt-1">{errors?.image}</p>}

                    </div>

                    <Dropdown
                        label="Select Dish Type"
                        options={dishOptions}
                        required
                        value={productData.dish_category_id || ""}
                        onChange={(e) => setProductData(prev => ({ ...prev, dish_category_id: e.target.value }))}
                        error={errors?.dish_category_id}
                    />
                    <div>
                        <Input
                            type="text"
                            name="name"
                            placeholder="Product Name"
                            label="Product Name"
                            value={productData.name}
                            required={true}
                            onChange={handleChange}
                            error={errors?.name}
                        />
                    </div>
                    <Input
                        type="number"
                        name="selling_price"
                        placeholder="Selling Price"
                        label="Selling Price"
                        value={productData.selling_price}
                        required
                        onChange={handleChange}
                        error={errors?.selling_price}
                    />
                    <Input
                        type="text"
                        name="description"
                        label="Description"
                        value={productData.description}
                        multiline={true}
                        placeholder="Description"
                        onChange={handleChange}
                        required
                        error={errors?.description}
                    />
                    <div className="col-span-3 md:col-span-2 flex justify-between items-center gap-6">
                        <RadioButton
                            label="Item Type"
                            name="veg_nonveg"
                            required
                            options={[
                                { label: "Veg", value: "veg" },
                                { label: "Non Veg", value: "Non Veg" },
                                { label: "Egg", value: "egg" },
                            ]}
                            selected={productData.veg_nonveg || ""}
                            onChange={(value) => {
                                setProductData(prev => ({ ...prev, veg_nonveg: value }));
                                setErrors(prev => ({ ...prev, veg_nonveg: "" }));
                            }}
                            error={errors?.veg_nonveg}
                        />

                        <RadioButton
                            label="Select Tags"
                            name="tag"
                            options={[
                                { label: "Mostly Order", value: "Mostly Order" },
                                { label: "Chef's Special", value: "Chef's Special" },
                                { label: "Best Selling", value: "Best Selling" },
                            ]}
                            selected={productData.tag}
                            // onChange={(value) => setProductData(prev => ({ ...prev, tag: value }))}
                            onChange={(value) => {
                                setProductData(prev => ({ ...prev, tag: value }));
                                setErrors(prev => ({ ...prev, tag: "" }));
                            }}
                        />

                        <CheckBox
                            label="Recommended"
                            name="recomended"
                            options={[
                                { label: "Recommended", value: "recomended" },
                            ]}
                            selected={
                                typeof productData.recomended === "boolean"
                                    ? productData.recomended
                                        ? ["recomended"]
                                        : []
                                    : (productData.recomended as string[])
                            }
                            onChange={handleRecommendedChange}
                        />
                    </div>
                </div>
                {/* <VariantsSection
                    variants={variants}
                    ref={variantsSectionRef}
                    setVariants={setVariants}
                    generatedCombinations={generatedCombinations}
                    setGeneratedCombinations={setGeneratedCombinations}
                    onCombinationsChange={handleCombinationsChange}
                /> */}
                {/* <AddonsSection
                    addons={addons}
                    setAddons={setAddons}
                    required={isAddonSectionOpen}
                    errors={errors?.addons}
                    setErrors={(updater) => {
                        setErrors(prev => ({
                            ...prev,
                            addons: typeof updater === "function"
                                ? updater(prev.addons)      // 👈 let child update only addons errors
                                : updater
                        }));
                    }}
                /> */}

                <div className="mt-8 flex gap-4">
                    <Button
                        label="Save Product"
                        variant="primary"
                        type="submit"
                    />
                </div>
            </form>
        </div>
    );
};

export default AddFoodItem;

// const AddFoodItem = () => {
//     return(
//         <h1>Coming Soon</h1>
//     )
// };

// export default AddFoodItem;