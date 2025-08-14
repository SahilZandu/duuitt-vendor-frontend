import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiArrowLeft, mdiDelete, mdiPlus } from "@mdi/js";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/apiInstance";
import type { FoodItem } from "../../../types/types";

// Define the IMAGE_BASE_URL constant
const IMAGE_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL|| "https://your-api-domain.com/uploads/";

interface Variant {
    name: string;
    id?: number;
    _id?: string; // Add this to match your existing types
}

interface VariantGroup {
    group: string;
    variant: Variant[];
}

interface Combination {
    first_gp: string;
    second_gp: string;
    price: string;
}

interface AddonItem {
    name: string;
    price: string;
    id: number;
}

// Use your existing FoodItem type and extend it for the edit form
interface ItemData extends Omit<FoodItem, '_id' | 'selling_price' | 'in_stock'> {
    selling_price: string | number;
    base_price?: string | number;
    status?: boolean;
    in_stock: boolean | number;
    recomended?: boolean;
    dish_category_id?: string;
    product_type?: "simple" | "variable";
    product_timing?: 'full_time' | 'partial_time';
    default_quantity?: number;
    title?: string;
    combinations?: Combination[];
}

interface ProductData {
    name: string;
    description: string;
    selling_price: string;
    product_type: "simple" | "variable";
    dish_category_id?: string;
    base_price?: string;
    tag?: string;
    veg_nonveg?: string;
    status?: boolean;
    in_stock?: boolean;
    recomended?: boolean;
    image?: File | null;
    title?: string;
    product_timing?: 'full_time' | 'partial_time';
    default_quantity?: number;
}

const FoodItemEdit = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    // Type itemData properly - it can be null or ItemData
    const [itemData, setItemData] = useState<ItemData | null>(null);

    useEffect(() => {
        if (!state?.itemId && !state?.item) {
            navigate('/food-item');
            return;
        }

        const fetchData = async () => {
            if (state.item) {
                // Type assertion with proper handling
                setItemData(state.item as ItemData);
            } else if (state?.itemId) {
                try {
                    const response = await axiosInstance("post", "/food-item/get", {
                        restaurant_id: localStorage.getItem("restaurant_id"),
                        dish_item_id: state.itemId,
                    });

                    // Ensure we have data before setting
                    if (response.data?.data) {
                        setItemData(response.data.data as ItemData);
                    } else {
                        toast.error("No item data found");
                        navigate("/food-item");
                    }
                } catch (error) {
                    toast.error("Failed to fetch item details");
                    console.error(error);
                    navigate("/food-item");
                }
            }
        };

        fetchData();
    }, [state, navigate]);

    useEffect(() => {
        if (itemData) {
            console.log(itemData,'itemDataitemDataitemDataitemData')
            setProductData(prev => ({
                ...prev,
                name: itemData.name || "",
                description: itemData.description || "",
                selling_price: String(itemData.selling_price || ""),
                base_price: String(itemData.base_price || ""),
                tag: itemData.tag || "",
                veg_nonveg: itemData.veg_nonveg || "",
                status: itemData.status ?? true,
                in_stock: Boolean(itemData.in_stock ?? true),
                recomended: itemData.recomended ?? false,
                dish_category_id: itemData.dish_category_id || "",
                product_type: itemData.product_type || "simple",
                product_timing: itemData.product_timing || "full_time",
                default_quantity: itemData.default_quantity || 1,
                title: itemData.title || "",
                image: null, // Do not set File object from existing image
            }));

            if (itemData.image) {
                setImagePreview(`${IMAGE_BASE_URL}${itemData.image}`);
            }

            // Set variants, combinations, and addons if they exist
            if (itemData.variants) {
                setVariantGroups(itemData.variants);
            }
            if (itemData.combinations) {
                setCombinations(itemData.combinations);
            }
            if (itemData.addon) {
                setAddonType("AddonAdd");
                // Handle addon structure based on your types
                if (Array.isArray(itemData.addon) && itemData.addon.length > 0) {
                    const firstAddon = itemData.addon[0];
                    setAddonGroupName(firstAddon.group || "");
                    setMaxSelectionLimit(firstAddon.max_selection || 1);
                    setIsPriceRelated(firstAddon.is_price_related ? "pricable" : "nonpricable");
                    setAddonItems(firstAddon.addon?.map((item: { _id: string; name: string; price?: number }) => ({
                        name: item.name,
                        price: String(item.price || ""),
                        id: parseInt(item._id) || Date.now()
                    })) || []);
                }
            }
        }
    }, [itemData]);

    const [dishCategories, setDishCategories] = useState<any[]>([]);
    const [productData, setProductData] = useState<ProductData>({
        name: "",
        description: "",
        selling_price: "",
        product_type: "simple",
        dish_category_id: "",
        base_price: "",
        tag: "",
        veg_nonveg: "",
        status: true,
        in_stock: true,
        recomended: false,
        image: null,
        // vendor_id: "",
        // restaurant_id: "",
        title: "",
        product_timing: "full_time",
        default_quantity: 1,
    });
console.log("productData----------------", productData);

    const [imagePreview, setImagePreview] = useState<string>("");

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

    const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);
    const [combinations, setCombinations] = useState<Combination[]>([]);

    const [addonType, setAddonType] = useState<"AddonAdd" | "">("");
    const [addonGroupName, setAddonGroupName] = useState("");
    const [maxSelectionLimit, setMaxSelectionLimit] = useState(1);
    const [isPriceRelated, setIsPriceRelated] = useState("");
    const [addonItems, setAddonItems] = useState<AddonItem[]>([]);

    // Handle input changes for basic product data
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setProductData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setProductData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Handle image upload
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProductData(prev => ({
                ...prev,
                image: file
            }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addVariantGroup = () => {
        setVariantGroups([...variantGroups, { group: "", variant: [] }]);
    };

    const updateVariantGroup = (index: number, field: keyof VariantGroup, value: any) => {
        const updatedGroups = [...variantGroups];
        if (field === "group") {
            updatedGroups[index][field] = value as string;
        }
        setVariantGroups(updatedGroups);
    };

    const removeVariantGroup = (index: number) => {
        const updatedGroups = [...variantGroups];
        updatedGroups.splice(index, 1);
        setVariantGroups(updatedGroups);
    };

    const addVariantToGroup = (groupIndex: number) => {
        const updatedGroups = [...variantGroups];
        updatedGroups[groupIndex].variant.push({ name: "", id: Date.now() });
        setVariantGroups(updatedGroups);
    };

    const updateVariant = (groupIndex: number, variantIndex: number, field: keyof Variant, value: string | number) => {
        const updatedGroups = [...variantGroups];
        updatedGroups[groupIndex].variant[variantIndex] = {
            ...updatedGroups[groupIndex].variant[variantIndex],
            [field]: value
        };
        setVariantGroups(updatedGroups);
    };

    const removeVariant = (groupIndex: number, variantIndex: number) => {
        const updatedGroups = [...variantGroups];
        updatedGroups[groupIndex].variant.splice(variantIndex, 1);
        setVariantGroups(updatedGroups);
    };

    const generateCombinations = () => {
        if (variantGroups.length < 2) return;
        const firstGroup = variantGroups[0].variant;
        const secondGroup = variantGroups[1].variant;
        const combos: Combination[] = [];

        firstGroup.forEach((f) => {
            secondGroup.forEach((s) => {
                combos.push({
                    first_gp: f.name,
                    second_gp: s.name,
                    price: "",
                });
            });
        });

        setCombinations(combos);
    };

    const updateCombinationPrice = (index: number, value: string) => {
        const updated = [...combinations];
        updated[index].price = value;
        setCombinations(updated);
    };

    const handleSubmit = async () => {
        try {
            // Create FormData for file upload
            const formData = new FormData();
            const restaurant_id = localStorage.getItem("restaurant_id");
            if (restaurant_id) {
                formData.append("restaurant_id", restaurant_id);
            }
            if (state.itemId) {
                formData.append("dish_item_id", state.itemId);
            }

            // Append basic product data according to DTO
            formData.append('name', productData.name);
            formData.append('description', productData.description);
            formData.append('base_price', productData.base_price || '0');
            formData.append('selling_price', productData.selling_price);
            formData.append('status', String(productData.status || true));

            // Optional fields
            if (productData.dish_category_id) {
                formData.append('dish_category_id', productData.dish_category_id);
            }
            if (productData.veg_nonveg) {
                formData.append('veg_nonveg', productData.veg_nonveg);
            }
            if (productData.product_type) {
                formData.append('product_type', productData.product_type);
            }
            if (productData.tag) {
                formData.append('tag', productData.tag);
            }
            if (productData.recomended !== undefined) {
                formData.append('recomended', String(productData.recomended));
            }
            if (productData.in_stock !== undefined) {
                formData.append('in_stock', String(productData.in_stock));
            }
            if (productData.image) {
                formData.append('image', productData.image);
            }

            // Handle variants according to DTO
            if (variantGroups.length > 0) {
                formData.append('variants', JSON.stringify(variantGroups));
            }

            // Handle combinations according to DTO
            if (combinations.length > 0) {
                formData.append('combinations', JSON.stringify(combinations));
            }

            // Handle addon according to DTO
            if (addonType === "AddonAdd" && addonGroupName && addonItems.length > 0) {
                const addonData = {
                    groupName: addonGroupName,
                    maxSelectionLimit: maxSelectionLimit,
                    isPriceRelated: isPriceRelated,
                    items: addonItems
                };
                formData.append('addon', JSON.stringify(addonData));
            }

            const selectedAddons: number[] = [];

            selectedAddons.forEach((id) => {
                formData.append('selected_add_on[]', String(id));
            });

            await axiosInstance("post", "/food-item/update", formData);
            toast.success("Product updated successfully");
            // navigate("/food-menu");
        } catch (error) {
            toast.error("Failed to update product");
            console.error(error);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Edit Food Item</h2>
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                    <Icon path={mdiArrowLeft} size={0.8} className="mr-2" />
                    <span className="text-sm font-medium">Back</span>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block font-medium mb-1">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={productData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        value={productData.description}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                        rows={3}
                    />
                </div>

                {/* Product Type */}
                <div>
                    <label className="block font-medium mb-1">Product Type</label>
                    <select
                        name="product_type"
                        value={productData.product_type}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                    >
                        <option value="simple">Simple</option>
                        <option value="variable">Variable</option>
                    </select>
                </div>

                {/* Category */}
                <div>
                    <label className="block font-medium mb-1">Dish Category</label>
                    <select
                        name="dish_category_id"
                        value={productData.dish_category_id}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                        required
                    >
                        <option value="">Select Category</option>
                        {dishCategories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Prices */}
                <div>
                    <label className="block font-medium mb-1">Base Price</label>
                    <input
                        type="number"
                        name="base_price"
                        value={productData.base_price}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Selling Price</label>
                    <input
                        type="number"
                        name="selling_price"
                        value={productData.selling_price}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                {/* Tag */}
                <div>
                    <label className="block font-medium mb-1">Tag</label>
                    <input
                        type="text"
                        name="tag"
                        value={productData.tag}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                {/* Additional DTO Fields */}
                <div>
                    <label className="block font-medium mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={productData.title}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Product Timing</label>
                    <select
                        name="product_timing"
                        value={productData.product_timing}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                    >
                        <option value="full_time">Full Time</option>
                        <option value="partial_time">Partial Time</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium mb-1">Default Quantity</label>
                    <input
                        type="number"
                        name="default_quantity"
                        value={productData.default_quantity}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                        min="1"
                    />
                </div>

                {/* Veg/Non-Veg */}
                <div>
                    <label className="block font-medium mb-1">Veg / Non-Veg</label>
                    <select
                        name="veg_nonveg"
                        value={productData.veg_nonveg}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                    >
                        <option value="">Select Food Type</option>
                        <option value="veg">Veg</option>
                        <option value="non_veg">Non-Veg</option>
                        <option value="egg">Egg</option>
                    </select>
                </div>

                {/* Image Upload */}
                <div className="col-span-1 md:col-span-2">
                    <label className="block font-medium mb-1">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border rounded p-2"
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            crossOrigin="anonymous"
                            className="w-32 h-32 mt-2 object-cover border rounded"
                        />
                    )}
                </div>

                {/* Checkboxes */}
                <div className="col-span-1 md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="status"
                                checked={productData.status || false}
                                onChange={handleInputChange}
                            />
                            Status
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="in_stock"
                                checked={productData.in_stock || false}
                                onChange={handleInputChange}
                            />
                            In Stock
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="recomended"
                                checked={productData.recomended || false}
                                onChange={handleInputChange}
                            />
                            Recommended
                        </label>
                    </div>
                </div>
            </div>

            {/* Variants Section */}
            {productData?.product_type === "variable" && (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Product Variants</h3>
                        <button
                            onClick={addVariantGroup}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                        >
                            <Icon path={mdiPlus} size={0.8} />
                            Add Variant Group
                        </button>
                    </div>

                    {variantGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="border p-4 rounded-md mb-4">
                            <div className="flex justify-between items-center mb-3 gap-2">
                                <input
                                    type="text"
                                    placeholder="Group Name (e.g., Size, Color)"
                                    value={group.group}
                                    onChange={(e) => updateVariantGroup(groupIndex, "group", e.target.value)}
                                    className="px-3 py-2 border rounded flex-1"
                                />
                                <button
                                    onClick={() => removeVariantGroup(groupIndex)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                >
                                    <Icon path={mdiDelete} size={1} />
                                </button>
                            </div>

                            {group.variant.map((variant, variantIndex) => (
                                <div key={variantIndex} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Variant Name (e.g., Small, Red)"
                                        value={variant.name}
                                        onChange={(e) => updateVariant(groupIndex, variantIndex, "name", e.target.value)}
                                        className="flex-1 px-3 py-2 border rounded"
                                    />
                                    <input
                                        type="number"
                                        placeholder="ID"
                                        value={variant.id}
                                        onChange={(e) => updateVariant(groupIndex, variantIndex, "id", parseInt(e.target.value) || 0)}
                                        className="w-20 px-3 py-2 border rounded"
                                    />
                                    <button
                                        onClick={() => removeVariant(groupIndex, variantIndex)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                    >
                                        <Icon path={mdiDelete} size={0.8} />
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={() => addVariantToGroup(groupIndex)}
                                className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm flex items-center gap-1"
                            >
                                <Icon path={mdiPlus} size={0.6} />
                                Add Variant
                            </button>
                        </div>
                    ))}

                    {variantGroups.length >= 2 && (
                        <button
                            onClick={generateCombinations}
                            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mt-4"
                        >
                            Generate Combinations
                        </button>
                    )}

                    {combinations.length > 0 && (
                        <div className="mt-6">
                            <h4 className="text-md font-semibold mb-3">Price Combinations</h4>
                            <div className="grid gap-2">
                                {combinations.map((combo, index) => (
                                    <div key={index} className="flex gap-2 items-center p-2 border rounded">
                                        <span className="flex-1 font-medium">
                                            {combo.first_gp} + {combo.second_gp}
                                        </span>
                                        <input
                                            type="number"
                                            placeholder="Price"
                                            value={combo.price}
                                            onChange={(e) => updateCombinationPrice(index, e.target.value)}
                                            className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Addon Section */}
            <div className="mt-10">
                <h3 className="text-lg font-semibold mb-4">Addons</h3>
                {addonType !== "AddonAdd" && (
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
                        onClick={() => setAddonType("AddonAdd")}
                    >
                        Add Addon Group
                    </button>
                )}

                {addonType === "AddonAdd" && (
                    <>
                        <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mb-4">
                            <div>
                                <label className="block font-medium mb-1">Addon Group Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Extra Toppings"
                                    value={addonGroupName}
                                    onChange={(e) => setAddonGroupName(e.target.value)}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Max Selection Limit</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={maxSelectionLimit}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 1;
                                        setMaxSelectionLimit(val);
                                        if (addonItems.length > val) {
                                            setAddonItems(addonItems.slice(0, val));
                                        }
                                    }}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Price Type</label>
                                <select
                                    value={isPriceRelated}
                                    onChange={(e) => setIsPriceRelated(e.target.value)}
                                    className="w-full border px-3 py-2 rounded"
                                >
                                    <option value="">Select</option>
                                    <option value="pricable">Pricable</option>
                                    <option value="nonpricable">Non Pricable</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-medium mb-2">Addon Items</h4>
                            {addonItems.map((item, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Addon Name"
                                        value={item.name}
                                        onChange={(e) => {
                                            const updated = [...addonItems];
                                            updated[index].name = e.target.value;
                                            setAddonItems(updated);
                                        }}
                                        className="flex-1 px-3 py-2 border rounded"
                                    />
                                    {isPriceRelated === "pricable" && (
                                        <input
                                            type="number"
                                            placeholder="Price"
                                            value={item.price}
                                            onChange={(e) => {
                                                const updated = [...addonItems];
                                                updated[index].price = e.target.value;
                                                setAddonItems(updated);
                                            }}
                                            className="w-24 px-3 py-2 border rounded"
                                        />
                                    )}
                                    <button
                                        onClick={() => setAddonItems(addonItems.filter((_, i) => i !== index))}
                                        className="text-red-500 hover:text-red-700 p-1"
                                    >
                                        <Icon path={mdiDelete} size={0.8} />
                                    </button>
                                </div>
                            ))}
                            {addonItems.length < maxSelectionLimit && (
                                <button
                                    onClick={() =>
                                        setAddonItems([...addonItems, { name: "", price: "", id: Date.now() }])
                                    }
                                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                                >
                                    <Icon path={mdiPlus} size={0.8} />
                                    Add Item
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                setAddonType("");
                                // Reset addon form
                                setAddonGroupName("");
                                setMaxSelectionLimit(1);
                                setIsPriceRelated("");
                                setAddonItems([]);
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel Addon
                        </button>
                    </>
                )}
            </div>

            {/* Submit */}
            <div className="mt-8 flex gap-4">
                <button
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-medium"
                >
                    Save Product
                </button>
                <button
                    onClick={() => navigate("/products")}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded font-medium"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default FoodItemEdit;


