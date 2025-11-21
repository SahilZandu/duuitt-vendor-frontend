import { useEffect, useState } from "react";
import axiosInstance from "../../../api/apiInstance";
import CommonCard from "../../../components/Ui/CommonCard";
import type { FoodItem } from "../../../types/types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteModal from "../../../components/modals/DeleteModal";
import Button from "../../../components/Ui/Button";
import MenuIcon from "../../../lib/MenuIcon";
import PageTitle from "../../../components/Ui/PageTitle";

const FoodMenu = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  console.log(deleting, "deleting");

  //   const IMAGE_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  const fetchFoodItems = async () => {
    try {
      const restaurant_id = localStorage.getItem("restaurant_id");
      const response = await axiosInstance("post", "/food-item/all", {
        restaurant_id,
      });
      const data = response.data.data || [];
      setFoodItems(data);
      setFilteredItems(data);
    } catch (error) {
      console.error("Error fetching food items:", error);
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  useEffect(() => {
    let filtered = [...foodItems];

    if (search.trim()) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== "All") {
      filtered = filtered.filter((item) => item.veg_nonveg === typeFilter);
    }

    if (priceFilter !== "All") {
      if (priceFilter === "0-100") {
        filtered = filtered.filter((item) => (item.selling_price ?? 0) <= 100);
      } else if (priceFilter === "100-300") {
        filtered = filtered.filter((item) => (item.selling_price ?? 0) > 100 && (item.selling_price ?? 0) <= 300);
      } else if (priceFilter === "300+") {
        filtered = filtered.filter((item) => (item.selling_price ?? 0) > 300);
      }
    }

    setFilteredItems(filtered);
    setVisibleCount(9);
  }, [search, foodItems, priceFilter, typeFilter]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 9);
      setLoadingMore(false);
    }, 800); // Simulated delay
  };
  const handleDeleteClick = (id: string) => {
    setSelectedItemId(id);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    if (!selectedItemId) return;

    setDeleting(true); // Start loader

    try {
      const response = await axiosInstance("post", "/food-item/delete", {
        restaurant_id: localStorage.getItem("restaurant_id"),
        dish_item_id: selectedItemId,
      });

      if (response?.data) {
        toast.success("Item deleted successfully.");
        await fetchFoodItems(); // Refresh list
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      toast.error("Failed to delete item.");
      console.error("Delete Error:", error);
    } finally {
      setDeleting(false); // Stop loader
      setShowDeleteModal(false);
      setSelectedItemId(null);
    }
  };

  return (
    <div className="p-4 h-[100vh] flex flex-col">
      {/* Sticky Filters */}
      <div className="bg-white z-10 sticky top-0 p-4 border-b">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
          <PageTitle title="Food Menu" />
          <Button
            onClick={() => navigate("/food-menu/add-product")}
            label="Add Product"
            variant="primary"
            iconLeft={<MenuIcon name="add" />}
            className="bg-[#8E3CF7] hover:bg-purple-700 text-white px-4 py-2 rounded-md transition"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#8E3CF7] focus:border-transparent"
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8E3CF7] focus:border-transparent"
          >
            <option value="All">All Types</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
            <option value="Egg">Egg</option>
          </select>

          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8E3CF7] focus:border-transparent"
          >
            <option value="All">All Prices</option>
            <option value="0-100">Under ₹100</option>
            <option value="100-300">₹100 - ₹300</option>
            <option value="300+">Above ₹300</option>
          </select>
        </div>
      </div>

      {/* Scrollable List */}
      <div className="overflow-y-auto flex-1 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.slice(0, visibleCount).map((item) => (
            <div key={item._id}>
              <CommonCard
                image={item?.image || "/placeholder.png"} // use image directly, fallback to placeholder
                title={item.name}
                description={item.description}
                price={item.selling_price}
                vegNonVeg={item.veg_nonveg}
                tag={item.tag}
                onViewDetails={() => navigate(`/food-item/${item._id}`)}
                onEdit={() =>
                  navigate("/food-item/edit", {
                    state: { itemId: item._id, item }, // pass anything you want
                  })
                }
                onDelete={() => handleDeleteClick(item._id)}
              />
            </div>
          ))}
        </div>

        {/* Load More */}
        {visibleCount < filteredItems.length && (
          <div className="text-center mt-6">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              disabled={loadingMore}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredItems.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No food items found.
          </p>
        )}
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        title="Delete Food Item"
        onClose={() => {
          setShowDeleteModal(false);
        }}
        onDelete={confirmDelete}
      />
    </div>
  );
};

export default FoodMenu;
