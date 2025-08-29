import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiArrowLeft, mdiDelete, mdiPlus } from "@mdi/js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../../api/apiInstance";

interface Variant {
  name: string;
  id: number;
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

interface AddonGroup {
  group: string;
  max_selection: number;
  is_price_related: string; // "true" | "false"
  addon: AddonItem[];
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
  vendor_id?: string;
  restaurant_id?: string;
  title?: string;
  product_timing?: "full_time" | "partial_time";
  default_quantity?: number;
}

const AddFoodItem = () => {
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
    title: "",
    product_timing: "full_time",
    default_quantity: 1,
  });

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

  // ✅ Multiple addon groups
  const [addonGroups, setAddonGroups] = useState<AddonGroup[]>([]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  // 🔹 Basic product input change
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setProductData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setProductData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🔹 Image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Variant group handlers
  const addVariantGroup = () => {
    if (variantGroups.length >= 2) {
      toast.warning("You can only add up to 2 variant groups.");
      return;
    }
    setVariantGroups([...variantGroups, { group: "", variant: [] }]);
  };

  const updateVariantGroup = (
    index: number,
    field: keyof VariantGroup,
    value: any
  ) => {
    const updatedGroups = [...variantGroups];
    updatedGroups[index][field] = value as any;
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

  const generateCombinations = () => {
    if (variantGroups.length < 2) return;
    const firstGroup = variantGroups[0].variant;
    const secondGroup = variantGroups[1].variant;
    const combos: Combination[] = [];
    firstGroup.forEach((f) =>
      secondGroup.forEach((s) =>
        combos.push({ first_gp: f.name, second_gp: s.name, price: "" })
      )
    );
    setCombinations(combos);
  };

  const updateCombinationPrice = (index: number, value: string) => {
    const updated = [...combinations];
    updated[index].price = value;
    setCombinations(updated);
  };

  // 🔹 Addon group handlers
  const addAddonGroup = () => {
    setAddonGroups([
      ...addonGroups,
      {
        group: "",
        max_selection: 1,
        is_price_related: "",
        addon: [{ name: "", price: "", id: Date.now() }],
      },
    ]);
  };

  const updateAddonGroup = (
    index: number,
    field: keyof AddonGroup,
    value: any
  ) => {
    const updated = [...addonGroups];
    (updated[index] as any)[field] = value;
    setAddonGroups(updated);
  };

  const addAddonItem = (groupIndex: number) => {
    const updated = [...addonGroups];
    updated[groupIndex].addon.push({ name: "", price: "", id: Date.now() });
    setAddonGroups(updated);
  };

  const updateAddonItem = (
    groupIndex: number,
    itemIndex: number,
    field: keyof AddonItem,
    value: string
  ) => {
    const updated = [...addonGroups];
    // updated[groupIndex].addon[itemIndex][field] = value;
    (updated[groupIndex].addon[itemIndex][field] as string | number) = value;

    setAddonGroups(updated);
  };

  const removeAddonItem = (groupIndex: number, itemIndex: number) => {
    const updated = [...addonGroups];
    updated[groupIndex].addon.splice(itemIndex, 1);
    setAddonGroups(updated);
  };

  const removeAddonGroup = (index: number) => {
    const updated = [...addonGroups];
    updated.splice(index, 1);
    setAddonGroups(updated);
  };

  // 🔹 Validation
  const validateForm = (): boolean => {
    const { name, base_price, product_type, dish_category_id } = productData;
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Product name is required.";
    if (!dish_category_id)
      newErrors.dish_category_id = "Dish category is required.";
    if (!base_price || isNaN(Number(base_price)) || Number(base_price) < 0) {
      newErrors.base_price = "Enter a valid base price.";
    }
    if (product_type === "variable" && variantGroups.length < 2) {
      newErrors.variantGroups =
        "At least two variant groups required for variable products.";
    }
    // if (product_type === "variable") {
    //   if (variantGroups.length < 1) {
    //     newErrors.variantGroups = "At least 1 variant groups required.";
    //   } else {
    //     variantGroups.forEach((group, gIndex) => {
    //       if (!group.group.trim()) {
    //         newErrors[`variantGroup_${gIndex}`] = `Variant group ${
    //           gIndex + 1
    //         } name is required.`;
    //       }
    //       if (group.variant.length === 0) {
    //         newErrors[
    //           `variantGroup_${gIndex}_variants`
    //         ] = `Add at least one variant in group ${gIndex + 1}.`;
    //       } else {
    //         group.variant.forEach((v, vIndex) => {
    //           if (!v.name.trim()) {
    //             newErrors[`variant_${gIndex}_${vIndex}`] = `Variant ${
    //               vIndex + 1
    //             } in group ${gIndex + 1} must have a name.`;
    //           }
    //         });
    //       }
    //     });
    //   }
    // }

    // 🔹 Addon validation (only if user added addons)
    if (addonGroups.length > 0) {
      addonGroups.forEach((group, gIndex) => {
        if (!group.group.trim()) {
          newErrors[`addonGroup_${gIndex}`] = `Addon group ${
            gIndex + 1
          } name is required.`;
        }
        if (!group.max_selection || group.max_selection < 1) {
          newErrors[`addonGroup_${gIndex}_max`] = `Addon group ${
            gIndex + 1
          } must allow at least 1 selection.`;
        }
        if (group.addon.length === 0) {
          newErrors[`addonGroup_${gIndex}_items`] = `Addon group ${
            gIndex + 1
          } must contain at least one item.`;
        } else {
          group.addon.forEach((item, iIndex) => {
            if (!item.name.trim()) {
              newErrors[`addon_${gIndex}_${iIndex}`] = `Addon item ${
                iIndex + 1
              } in group ${gIndex + 1} must have a name.`;
            }
            if (
              group.is_price_related === "true" &&
              (!item.price || Number(item.price) <= 0)
            ) {
              newErrors[`addon_${gIndex}_${iIndex}_price`] = `Addon item ${
                iIndex + 1
              } in group ${gIndex + 1} must have a valid price.`;
            }
          });
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Submit
  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const formData = new FormData();
      const restaurant_id = localStorage.getItem("restaurant_id");
      if (restaurant_id) formData.append("restaurant_id", restaurant_id);

      // Basic product data
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("base_price", productData.base_price || "0");
      formData.append("selling_price", productData.base_price || "0");
      formData.append("status", String(productData.status || true));

      if (productData.dish_category_id)
        formData.append("dish_category_id", productData.dish_category_id);
      if (productData.veg_nonveg)
        formData.append("veg_nonveg", productData.veg_nonveg);
      if (productData.product_type)
        formData.append("product_type", productData.product_type);
      if (productData.tag) formData.append("tag", productData.tag);
      if (productData.recomended !== undefined)
        formData.append("recomended", String(productData.recomended));
      if (productData.in_stock !== undefined)
        formData.append("in_stock", String(productData.in_stock));
      if (productData.image) formData.append("image", productData.image);

      if (variantGroups.length > 0)
        formData.append("variants", JSON.stringify(variantGroups));
      if (combinations.length > 0)
        formData.append("combinations", JSON.stringify(combinations));

      // ✅ Addons
      if (addonGroups.length > 0) {
        formData.append("addon", JSON.stringify(addonGroups));
      }

      await axiosInstance("post", "/food-item", formData);
      toast.success("Product added successfully");
      navigate("/food-menu");
    } catch (error) {
      toast.error("Failed to add product");
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Add Product</h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <Icon path={mdiArrowLeft} size={0.9} />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Card Container */}
      <div className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block font-medium mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                rows={3}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

            {/* Product Type */}
            <div>
              <label className="block font-medium mb-1">Product Type</label>
              <select
                name="product_type"
                value={productData.product_type}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              >
                <option value="simple">Simple</option>
                <option value="variable">Variable</option>
              </select>
            </div>

            {/* Dish Category */}
            <div>
              <label className="block font-medium mb-1">Select Dish Type</label>
              <select
                name="dish_category_id"
                value={productData.dish_category_id}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 ${
                  errors.dish_category_id ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Dish</option>
                {dishCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Base Price */}
            <div>
              <label className="block font-medium mb-1">Selling Price</label>
              <input
                type="number"
                name="base_price"
                value={productData.base_price}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 ${
                  errors.base_price ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>

            {/* Image Upload */}
            <div className="col-span-1 md:col-span-2">
              <label className="block font-medium mb-1">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded-lg px-3 py-2"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 mt-2 object-cover border rounded-lg shadow-sm"
                />
              )}
            </div>
          </div>
        </div>

        {/* Variants Section */}
        {productData.product_type === "variable" && (
          <div className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">
              Item Variants
            </h3>
            {variantGroups.length < 2 && (
              <button
                onClick={addVariantGroup}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                <Icon path={mdiPlus} size={0.8} />
                Add Variant Group
              </button>
            )}

            {/* Variant Groups */}
            {variantGroups.length > 0 && (
              <div
                className={`grid gap-6 ${
                  variantGroups.length === 2
                    ? "md:grid-cols-2"
                    : "md:grid-cols-1"
                }`}
              >
                {variantGroups.map((group, gIndex) => (
                  <div
                    key={gIndex}
                    className="border p-4 rounded-md bg-gray-50 shadow-sm"
                  >
                    {/* Group Name */}
                    <div className="flex justify-between items-center mb-3 gap-2">
                      <input
                        type="text"
                        placeholder="Group Name (e.g., Size, Color)"
                        value={group.group}
                        onChange={(e) =>
                          updateVariantGroup(gIndex, "group", e.target.value)
                        }
                        className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-300"
                      />
                      <button
                        onClick={() => removeVariantGroup(gIndex)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Icon path={mdiDelete} size={1} />
                      </button>
                    </div>

                    {/* Variants inside group */}
                    {group.variant.map((v, vIndex) => (
                      <div key={vIndex} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Variant Name"
                          value={v.name}
                          onChange={(e) =>
                            updateVariant(
                              gIndex,
                              vIndex,
                              "name",
                              e.target.value
                            )
                          }
                          className="flex-2 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-300"
                        />
                        {/* <input
                        type="number"
                        placeholder="Add variant Price"
                        onChange={(e) =>
                          updateVariant(
                            gIndex,
                            vIndex,
                            "id",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-50 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-300"
                      /> */}
                        <button
                          onClick={() => removeVariant(gIndex, vIndex)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Icon path={mdiDelete} size={0.8} />
                        </button>
                      </div>
                    ))}

                    {/* Add Variant */}
                    <button
                      onClick={() => addVariantToGroup(gIndex)}
                      className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm flex items-center gap-1"
                    >
                      <Icon path={mdiPlus} size={0.6} />
                      Add Variant
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Generate Combinations */}
            {variantGroups.length === 2 && (
              <>
                <button
                  onClick={generateCombinations}
                  className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                >
                  Generate Combinations
                </button>

                {combinations.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-3">
                      Price Combinations
                    </h4>
                    <div className="grid gap-2">
                      {combinations.map((combo, index) => (
                        <div
                          key={index}
                          className="flex gap-2 items-center p-2 border rounded"
                        >
                          <span className="flex-1 font-medium">
                            {combo.first_gp} + {combo.second_gp}
                          </span>
                          <input
                            type="number"
                            placeholder="Price"
                            value={combo.price}
                            onChange={(e) =>
                              updateCombinationPrice(index, e.target.value)
                            }
                            className="w-24 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Addons Section */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">Addons</h3>
          {addonGroups.map((group, gIndex) => (
            <div key={gIndex} className="border p-4 rounded mb-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">Addon Group {gIndex + 1}</h4>
                <button
                  onClick={() => removeAddonGroup(gIndex)}
                  className="text-red-500"
                >
                  <Icon path={mdiDelete} size={1} />
                </button>
              </div>

              <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Addon Group Name"
                  value={group.group}
                  onChange={(e) =>
                    updateAddonGroup(gIndex, "group", e.target.value)
                  }
                  className="border px-3 py-2 rounded"
                />
                <input
                  type="number"
                  min={1}
                  value={group.max_selection}
                  onChange={(e) =>
                    updateAddonGroup(
                      gIndex,
                      "max_selection",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="border px-3 py-2 rounded"
                />
                <select
                  value={group.is_price_related}
                  onChange={(e) =>
                    updateAddonGroup(gIndex, "is_price_related", e.target.value)
                  }
                  className="border px-3 py-2 rounded"
                >
                  <option value="">Select</option>
                  <option value="true">Pricable</option>
                  <option value="false">Non Pricable</option>
                </select>
              </div>

              {/* Items */}
              {group.addon.map((item, iIndex) => (
                <div key={iIndex} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Addon Name"
                    value={item.name}
                    onChange={(e) =>
                      updateAddonItem(gIndex, iIndex, "name", e.target.value)
                    }
                    className="flex-1 border px-3 py-2 rounded"
                  />
                  {group.is_price_related === "true" && (
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) =>
                        updateAddonItem(gIndex, iIndex, "price", e.target.value)
                      }
                      className="w-24 border px-3 py-2 rounded"
                    />
                  )}
                  <button
                    onClick={() => removeAddonItem(gIndex, iIndex)}
                    className="text-red-500"
                  >
                    <Icon path={mdiDelete} size={0.8} />
                  </button>
                </div>
              ))}

              <button
                onClick={() => addAddonItem(gIndex)}
                className="bg-green-500 text-white px-3 py-1 rounded mt-2 flex items-center gap-2"
              >
                <Icon path={mdiPlus} size={0.8} /> Add Item
              </button>
            </div>
          ))}

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            onClick={addAddonGroup}
          >
            Add Addon Group
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium shadow"
          >
            Save Product
          </button>
          <button
            onClick={() => navigate("/products")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium shadow"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFoodItem;
