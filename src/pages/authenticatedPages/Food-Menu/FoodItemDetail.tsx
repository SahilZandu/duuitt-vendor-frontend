import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/apiInstance";
import type { FoodItem } from "../../../types/types";
import { mdiArrowLeft } from "@mdi/js";

const FoodItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axiosInstance("post", "/food-item/get", {
          restaurant_id: localStorage.getItem("restaurant_id"),
          dish_item_id: id,
        });
        setFoodItem(response.data.data);
      } catch (error) {
        console.error("Error fetching food item:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!foodItem)
    return <div className="p-6 text-center">Food item not found</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d={mdiArrowLeft} />
          </svg>
          <span className="font-medium">Back</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Hero Section */}
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={foodItem.image ? `${foodItem.image}` : "/default-food.jpg"}
              alt={foodItem.name}
              crossOrigin="anonymous"
              className="w-full h-80 md:h-full object-cover"
            />
          </div>

          <div className="md:w-1/2 p-8">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-800">{foodItem.name}</h1>
              <span
                className={`px-3 py-1 text-sm rounded-full font-semibold ${
                  foodItem.veg_nonveg === "veg"
                    ? "bg-green-100 text-green-700"
                    : foodItem.veg_nonveg === "egg"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {foodItem.veg_nonveg}
              </span>
            </div>

            <p className="text-gray-600 mb-6">{foodItem.description || "No description available"}</p>

            <div className="text-3xl font-bold text-[#8E3CF7] mb-6">
              ₹{foodItem.selling_price}
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <span
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  foodItem.in_stock
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {foodItem.in_stock ? "In Stock" : "Out of Stock"}
              </span>
              {foodItem.tag && (
                <span className="px-4 py-2 rounded-lg text-sm font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                  {foodItem.tag}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Variants & Addons Section */}
        <div className="p-8 border-t border-gray-100">
          {Array.isArray(foodItem.variants) && foodItem.variants.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#8E3CF7] rounded-full"></span>
                Variants
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {foodItem.variants.map((group, i) => (
                  <div
                    key={i}
                    className="bg-purple-50 border border-purple-100 p-4 rounded-xl"
                  >
                    <p className="font-semibold text-gray-800 mb-3">{group.group}</p>
                    <div className="space-y-2">
                      {group.variant.map((v) => {
                        const combination = foodItem.combinations?.find(
                          (c) => c.first_gp === v.name || c.second_gp === v.name
                        );
                        const price = combination?.price;
                        return (
                          <div key={v._id} className="flex justify-between items-center bg-white px-3 py-2 rounded-lg">
                            <span className="text-gray-700">{v.name}</span>
                            {price && (
                              <span className="font-semibold text-[#8E3CF7]">₹{price}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(foodItem.addon) && foodItem.addon.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                Addons
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {foodItem.addon.map((group, i) => (
                  <div
                    key={i}
                    className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-semibold text-gray-800">{group.group}</p>
                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                        Max: {group.max_selection}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {group.addon.map((a) => (
                        <div key={a._id} className="flex justify-between items-center bg-white px-3 py-2 rounded-lg">
                          <span className="text-gray-700">{a.name}</span>
                          {group.is_price_related && (a.price ?? 0) > 0 && (
                            <span className="font-semibold text-[#8E3CF7]">+₹{a.price}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItemDetail;
