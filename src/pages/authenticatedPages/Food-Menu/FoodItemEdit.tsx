import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiArrowLeft, mdiDelete, mdiPlus } from "@mdi/js";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/apiInstance";
import type { AddonGroups, FoodItem } from "../../../types/types";
import RadioButton from "../../../components/Ui/RadioButton";

// Define the IMAGE_BASE_URL constant
const IMAGE_BASE_URL =
  import.meta.env.VITE_BACKEND_BASE_URL ||
  "https://your-api-domain.com/uploads/";

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
  second_gp: string | null;
  price: string;
}
interface AddonGroup {
  group: string;
  max_selection: number;
  is_price_related: boolean;
  addon: AddonItem[];
}

interface AddonItem {
  _id: string;
  name: string;
  price?: number;
  id?: number; // Add this to match usage in code
}
// Use your existing FoodItem type and extend it for the edit form
interface ItemData
  extends Omit<FoodItem, "_id" | "selling_price" | "in_stock"> {
  selling_price: string | number;
  base_price?: string | number;
  status?: boolean;
  in_stock: boolean | number;
  recomended?: boolean;
  dish_category_id?: string;
  product_type?: "simple" | "variable";
  product_timing?: "full_time" | "partial_time";
  default_quantity?: number;
  title?: string;
  combinations?: Combination[];
  addon?: AddonGroup[];
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
  product_timing?: "full_time" | "partial_time";
  default_quantity?: number;
}

const FoodItemEdit = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Type itemData properly - it can be null or ItemData
  const [itemData, setItemData] = useState<ItemData | null>(null);
  const [addonGroups, setAddonGroups] = useState<AddonGroups[]>([]);

  useEffect(() => {
    if (!state?.itemId && !state?.item) {
      navigate("/food-item");
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
      console.log(itemData, "itemDataitemDataitemDataitemData");
      setProductData((prev) => ({
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
      if (itemData.addon && Array.isArray(itemData.addon)) {
        const groups: AddonGroups[] = itemData.addon.map((group, gIdx) => ({
          id: gIdx + 1,
          group: group.group || "",
          addon:
            group.addon?.map((item, iIdx) => ({
              id: item.id ?? iIdx + 1,
              name: item.name,
              price: String(item.price || ""),
            })) || [],
          is_price_related: !!group.is_price_related,
          max_selection: String(group.max_selection || 1),
        }));

        setAddonGroups(groups);
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Handle input changes for basic product data
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setProductData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setProductData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductData((prev) => ({
        ...prev,
        image: file,
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

  const updateVariantGroup = (
    index: number,
    field: keyof VariantGroup,
    value: string
  ) => {
    const updatedGroups = [...variantGroups];
    if (field === "group") {
      updatedGroups[index][field] = value;
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

  const updateVariant = (
    groupIndex: number,
    variantIndex: number,
    field: keyof Variant,
    value: string | number
  ) => {
    const updatedGroups = [...variantGroups];
    updatedGroups[groupIndex].variant[variantIndex] = {
      ...updatedGroups[groupIndex].variant[variantIndex],
      [field]: value,
    };
    setVariantGroups(updatedGroups);
  };

  const removeVariant = (groupIndex: number, variantIndex: number) => {
    const updatedGroups = [...variantGroups];
    updatedGroups[groupIndex].variant.splice(variantIndex, 1);
    setVariantGroups(updatedGroups);
  };

  // Generate combinations
  const generateCombinations = () => {
    let newCombinations: Combination[] = [];

    if (variantGroups.length === 1) {
      // ✅ Only one group → list each variant
      newCombinations = variantGroups[0].variant.map((v) => ({
        first_gp: v.name,
        second_gp: null,
        price: "",
      }));
    } else if (variantGroups.length === 2) {
      // ✅ Two groups → cross join
      newCombinations = variantGroups[0].variant.flatMap((v1) =>
        variantGroups[1].variant.map((v2) => ({
          first_gp: v1.name,
          second_gp: v2.name,
          price: "",
        }))
      );
    }

    setCombinations(newCombinations);
  };

  // Update price
  const updateCombinationPrice = (index: number, price: string) => {
    const updated = [...combinations];
    updated[index].price = price;
    setCombinations(updated);
  };

  // 🔹 Validation function
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Basic Info
    if (!productData.name.trim()) newErrors.name = "Product name is required.";
    if (!productData.dish_category_id)
      newErrors.dish_category_id = "Dish category is required.";
    if (!productData.veg_nonveg)
      newErrors.veg_nonveg = "Item type (Veg/Non-Veg/Egg) is required.";

    // Pricing
    if (
      !productData.base_price ||
      isNaN(Number(productData.base_price)) ||
      Number(productData.base_price) < 0
    ) {
      newErrors.base_price = "Enter a valid base price.";
    }
    if (
      productData.selling_price &&
      (isNaN(Number(productData.selling_price)) ||
        Number(productData.selling_price) < 0)
    ) {
      newErrors.selling_price = "Enter a valid selling price.";
    }

    // Variants
    if (productData.product_type === "variable") {
      if (variantGroups.length === 0) {
        newErrors.variantGroups = "At least one variant group required.";
      } else if (variantGroups.some((g) => !g.group.trim())) {
        newErrors.variantGroups = "All variant groups must have a name.";
      } else if (variantGroups.some((g) => g.variant.length === 0)) {
        newErrors.variantGroups =
          "Each variant group must have at least one variant.";
      } else if (
        variantGroups.some((g) => g.variant.some((v) => !v.name.trim()))
      ) {
        newErrors.variantGroups = "Variant names cannot be empty.";
      }
    }

    // Combinations
    if (combinations.length > 0) {
      combinations.forEach((combo, idx) => {
        if (
          !combo.price ||
          isNaN(Number(combo.price)) ||
          Number(combo.price) < 0
        ) {
          newErrors[`combination_${idx}`] =
            "Each combination must have a valid price.";
        }
      });
    }

    // Addons
    addonGroups.forEach((group, gIdx) => {
      if (!group.group.trim()) {
        newErrors[`addon_group_${gIdx}`] = "Addon group name is required.";
      }
      if (group.addon.length === 0) {
        newErrors[`addon_group_${gIdx}`] =
          "Each addon group must have at least one item.";
      }
      group.addon.forEach((item, iIdx) => {
        if (!item.name.trim()) {
          newErrors[`addon_${gIdx}_${iIdx}`] = "Addon name is required.";
        }
        if (
          group.is_price_related &&
          (!item.price || isNaN(Number(item.price)) || Number(item.price) < 0)
        ) {
          newErrors[`addon_${gIdx}_${iIdx}_price`] =
            "Enter a valid price for addon.";
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Handle Submit with Validation
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors.");
      return;
    }

    try {
      const formData = new FormData();
      const restaurant_id = localStorage.getItem("restaurant_id");
      if (restaurant_id) formData.append("restaurant_id", restaurant_id);
      if (state.itemId) formData.append("dish_item_id", state.itemId);

      // Append basic fields
      Object.entries(productData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== "image") {
          formData.append(key, String(value));
        }
      });

      // Image
      if (productData.image) formData.append("image", productData.image);

      // Variants
      if (variantGroups.length > 0) {
        formData.append("variants", JSON.stringify(variantGroups));
      }

      // Combinations
      if (combinations.length > 0) {
        formData.append("combinations", JSON.stringify(combinations));
      }

      // Addons
      if (addonGroups.length > 0) {
        formData.append("addon", JSON.stringify(addonGroups));
      }

      await axiosInstance("post", "/food-item/update", formData);
      toast.success("Product updated successfully");
      navigate("/food-menu");
    } catch (error) {
      toast.error("Failed to update product");
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Title + Back */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Edit Food Item</h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Icon path={mdiArrowLeft} size={0.8} className="mr-2" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Basic Info Card */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div>
            <label className="block font-medium mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              value={productData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              value={productData.description}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Product Type */}
          <div>
            <label className="block font-medium mb-1">Product Type</label>
            <select
              name="product_type"
              value={productData.product_type}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
            >
              <option value="simple">Simple</option>
              <option value="variable">Variable</option>
            </select>
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.product_type}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium mb-1">Dish Category</label>
            <select
              name="dish_category_id"
              value={productData.dish_category_id}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
            >
              <option value="">Select Category</option>
              {dishCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.dish_category_id}</p>
            )}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Base Price</label>
            <input
              type="number"
              name="base_price"
              value={productData.base_price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
            />
            {errors.base_price && (
              <p className="text-red-500 text-sm">{errors.base_price}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Selling Price</label>
            <input
              type="number"
              name="selling_price"
              value={productData.selling_price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
            />
            {errors.selling_price && (
              <p className="text-red-500 text-sm">{errors.selling_price}</p>
            )}
          </div>
        </div>
      </div>

      {/* Image + Status */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Media & Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Image Upload */}
          <div>
            <label className="block font-medium mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border rounded-lg p-2"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 mt-2 object-cover border rounded-lg"
              />
            )}
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image}</p>
            )}
          </div>

          {/* Status Checkboxes */}
          <div className="flex flex-col gap-3 mt-2">
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

      {/* Tags + Item Type */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Tags & Type</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Item Type */}
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
              setProductData((prev) => ({ ...prev, veg_nonveg: value }));
              setErrors((prev) => ({ ...prev, veg_nonveg: "" }));
            }}
            error={errors?.veg_nonveg}
          />

          {/* Tags */}
          <RadioButton
            label="Select Tags"
            name="tag"
            options={[
              { label: "Mostly Order", value: "Mostly Order" },
              { label: "Chef's Special", value: "Chef's Special" },
              { label: "Best Selling", value: "Best Selling" },
            ]}
            selected={productData.tag ?? ""}
            onChange={(value) => {
              setProductData((prev) => ({ ...prev, tag: value }));
              setErrors((prev) => ({ ...prev, tag: "" }));
            }}
            error={errors?.tag}
          />
        </div>
      </div>

      {/* Variants Section (if variable) */}
      {productData?.product_type === "variable" && (
        <div className="bg-white shadow rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Product Variants</h3>

          {/* Show button only if less than 2 groups */}
          {variantGroups.length < 2 && (
            <button
              onClick={addVariantGroup}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
            >
              <Icon path={mdiPlus} size={0.8} />
              Add Variant Group
            </button>
          )}

          {/* Groups */}
          {variantGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="border p-4 rounded-md mb-4">
              <div className="flex justify-between items-center mb-3 gap-2">
                <input
                  type="text"
                  placeholder="Group Name (e.g., Size, Color)"
                  value={group.group}
                  onChange={(e) =>
                    updateVariantGroup(groupIndex, "group", e.target.value)
                  }
                  className="px-3 py-2 border rounded flex-1"
                />
                <button
                  onClick={() => removeVariantGroup(groupIndex)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Icon path={mdiDelete} size={1} />
                </button>
              </div>

              {/* Error for group name */}
              {errors[`variant_group_${groupIndex}`] && (
                <p className="text-red-500 text-sm mb-2">
                  {errors[`variant_group_${groupIndex}`]}
                </p>
              )}

              {group.variant.map((variant, variantIndex) => (
                <div key={variantIndex} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Variant Name (e.g., Small, Red)"
                    value={variant.name}
                    onChange={(e) =>
                      updateVariant(
                        groupIndex,
                        variantIndex,
                        "name",
                        e.target.value
                      )
                    }
                    className="flex-1 px-3 py-2 border rounded"
                  />
                  <button
                    onClick={() => removeVariant(groupIndex, variantIndex)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Icon path={mdiDelete} size={0.8} />
                  </button>
                </div>
              ))}

              {/* Variant-level errors */}
              {group.variant.map(
                (_, variantIndex) =>
                  errors[`variant_${groupIndex}_${variantIndex}`] && (
                    <p
                      key={`variant_err_${groupIndex}_${variantIndex}`}
                      className="text-red-500 text-sm mb-2"
                    >
                      {errors[`variant_${groupIndex}_${variantIndex}`]}
                    </p>
                  )
              )}

              <button
                onClick={() => addVariantToGroup(groupIndex)}
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm flex items-center gap-1"
              >
                <Icon path={mdiPlus} size={0.6} />
                Add Variant
              </button>
            </div>
          ))}

          {/* General variants error */}
          {errors.variantGroups && (
            <p className="text-red-500 text-sm">{errors.variantGroups}</p>
          )}

          {/* Generate Combinations button */}
          {variantGroups.length > 0 &&
            variantGroups.some((g) => g.variant.length > 0) && (
              <button
                onClick={generateCombinations}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mt-4"
              >
                Generate Combinations
              </button>
            )}

          {/* Show combinations */}
          {combinations.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-semibold mb-3">Price Combinations</h4>
              <div className="grid gap-2">
                {combinations.map((combo, index) => (
                  <div
                    key={index}
                    className="flex gap-2 items-center p-2 border rounded"
                  >
                    <span className="flex-1 font-medium">
                      {combo.second_gp
                        ? `${combo.first_gp} + ${combo.second_gp}`
                        : combo.first_gp}
                    </span>
                    <input
                      type="number"
                      placeholder="Price"
                      value={combo.price}
                      onChange={(e) =>
                        updateCombinationPrice(index, e.target.value)
                      }
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                ))}
              </div>
              {/* Errors for combinations */}
              {combinations.map((_, idx) =>
                errors[`combination_${idx}`] ? (
                  <p key={`combo_err_${idx}`} className="text-red-500 text-sm">
                    {errors[`combination_${idx}`]}
                  </p>
                ) : null
              )}
            </div>
          )}
        </div>
      )}

      {/* Addons */}

      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Addons</h3>

        {addonGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="relative border rounded p-4 mb-4">
            {/* Group Name with Delete Button (flex layout) */}
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={group.group}
                placeholder="Addon Group Name"
                onChange={(e) => {
                  const updated = [...addonGroups];
                  updated[groupIndex].group = e.target.value;
                  setAddonGroups(updated);
                }}
                className="w-[90%] border rounded px-3 py-2"
              />
              <button
                onClick={() => {
                  const updated = [...addonGroups];
                  updated.splice(groupIndex, 1); // remove group & its addons
                  setAddonGroups(updated);
                }}
                className="w-[10%] flex justify-center text-red-500 hover:text-red-700"
                title="Delete Addon Group"
              >
                <Icon path={mdiDelete} size={1} />
              </button>
            </div>

            {/* Max Selection + Price Related */}
            <div className="flex gap-4 mb-3">
              <div className="flex items-center gap-2">
                <label>Max Selection:</label>
                <input
                  type="number"
                  min="1"
                  value={group.max_selection}
                  onChange={(e) => {
                    const updated = [...addonGroups];
                    updated[groupIndex].max_selection = e.target.value;
                    setAddonGroups(updated);
                  }}
                  className="w-20 border rounded px-2 py-1"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={group.is_price_related}
                  onChange={(e) => {
                    const updated = [...addonGroups];
                    updated[groupIndex].is_price_related = e.target.checked;
                    setAddonGroups(updated);
                  }}
                />
                Price Related
              </label>
            </div>

            {/* Addon Items */}
            {group.addon.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item.name}
                  placeholder="Addon Name"
                  onChange={(e) => {
                    const updated = [...addonGroups];
                    updated[groupIndex].addon[i].name = e.target.value;
                    setAddonGroups(updated);
                  }}
                  className="flex-1 border rounded px-3 py-2"
                />
                {group.is_price_related && (
                  <input
                    type="number"
                    value={item.price}
                    placeholder="Price"
                    onChange={(e) => {
                      const updated = [...addonGroups];
                      updated[groupIndex].addon[i].price = e.target.value;
                      setAddonGroups(updated);
                    }}
                    className="w-24 border rounded px-2 py-2"
                  />
                )}
                <button
                  onClick={() => {
                    const updated = [...addonGroups];
                    updated[groupIndex].addon.splice(i, 1);
                    setAddonGroups(updated);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Icon path={mdiDelete} size={0.8} />
                </button>
              </div>
            ))}

            {/* Addon-level errors */}
            {group.addon.map((_, i) => (
              <div key={`addon_err_${groupIndex}_${i}`} className="space-y-1">
                {errors[`addon_${groupIndex}_${i}`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`addon_${groupIndex}_${i}`]}
                  </p>
                )}
                {errors[`addon_${groupIndex}_${i}_price`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`addon_${groupIndex}_${i}_price`]}
                  </p>
                )}
              </div>
            ))}

            {/* Add Addon Button */}
            <button
              onClick={() => {
                const updated = [...addonGroups];
                updated[groupIndex].addon.push({
                  name: "",
                  price: "",
                  id: Date.now(),
                });
                setAddonGroups(updated);
              }}
              className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm flex items-center gap-1"
            >
              <Icon path={mdiPlus} size={0.6} />
              Add Addon
            </button>
          </div>
        ))}

        <button
          onClick={() =>
            setAddonGroups([
              ...addonGroups,
              {
                id: Date.now(), // or generate a unique id as needed
                groupName: "",
                priceable: false,
                maxSelectionLimit: "1",
                values: [{ name: "", price: "", id: Date.now() }],
                // If you need to keep compatibility with your local AddonGroup type, you can add those fields too
                group: "",
                max_selection: "1",
                is_price_related: false,
                addon: [{ name: "", price: "", id: Date.now() }],
              },
            ])
          }
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <Icon path={mdiPlus} size={0.8} />
          Add Addon Group
        </button>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          Save Product
        </button>
        <button
          onClick={() => navigate("/products")}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default FoodItemEdit;
