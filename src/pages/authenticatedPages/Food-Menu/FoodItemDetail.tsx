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
    const IMAGE_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

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
    if (!foodItem) return <div className="p-6 text-center">Food item not found</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="mr-2">
                        <path d={mdiArrowLeft} />
                    </svg>
                    <span className="text-sm font-medium">Back</span>
                </button>

                <h2 className="text-3xl font-bold text-gray-800">{foodItem.name}</h2>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                <img
                    src={foodItem.image ? `${IMAGE_BASE_URL}${foodItem.image}` : "/default-food.jpg"}
                    alt={foodItem.name}
                    crossOrigin="anonymous"
                    className="w-full h-72 object-cover rounded-lg shadow"
                />

                <div className="grid md:grid-cols-2 gap-6 text-gray-700 text-base">
                    <p><strong>Description:</strong> {foodItem.description || "N/A"}</p>
                    <p><strong>Price:</strong> ₹{foodItem.selling_price}</p>
                    <p>
                        <strong>Type:</strong>
                        <span className={`ml-2 px-2 py-0.5 text-sm rounded-full font-semibold ${foodItem.veg_nonveg === "veg" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {foodItem.veg_nonveg}
                        </span>
                    </p>
                    <p>
                        <strong>Status:</strong>
                        <span className={`ml-2 px-2 py-0.5 text-sm rounded-full font-semibold ${foodItem.in_stock ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-600"}`}>
                            {foodItem.in_stock ? "In Stock" : "Out of Stock"}
                        </span>
                    </p>
                    <p><strong>Tag:</strong> {foodItem.tag || "None"}</p>
                </div>

                {Array.isArray(foodItem.variants) && foodItem.variants.length > 0 && (
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Variants</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {foodItem.variants.map((group, i) => (
                                <div key={i} className="border p-4 rounded-md shadow-sm bg-gray-50">
                                    <p className="font-medium mb-2">{group.group}</p>
                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                        {group.variant.map((v) => (
                                            <li key={v._id}>{v.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {Array.isArray(foodItem.addon) && foodItem.addon.length > 0 && (
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Addons</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {foodItem.addon.map((group, i) => (
                                <div key={i} className="border p-4 rounded-md shadow-sm bg-yellow-50">
                                    <p className="font-medium mb-2">
                                        {group.group}{" "}
                                        <span className="text-xs text-gray-500">(Max: {group.max_selection})</span>
                                    </p>
                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                        {group.addon.map((a) => (
                                            <li key={a._id}>
                                                {a.name}{" "}
                                                {group.is_price_related && (
                                                    <span className="text-gray-500">- ₹{a.price}</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default FoodItemDetail;
