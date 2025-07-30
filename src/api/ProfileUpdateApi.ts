import apiRequest from "./apiInstance";

export type Restaurant = {
    banner: string;
    assets: string[];
    name: string;
    about: string;
    address: string;
    phone: string;
    email: string;
    date_of_founding: string;
    veg_non_veg: string;
    minimum_order_value: string;
    minimum_order_preparation_time: string;
};

export const fetchRestaurantDetails = async (
    restaurant_id: string
): Promise<Restaurant | null> => {
    try {
        const payload = { restaurant_id };
        const response = await apiRequest("post", "/restaurant/get", payload);
        return response?.data?.data || null;
    } catch (error) {
        console.error("Error fetching restaurant details:", error);
        return null;
    }
};

export const updateRestaurantProfile = async (
    restaurant_id: string,
    formData: FormData
): Promise<Restaurant | null> => {
    try {
        // No need to add restaurant_id in payload because we can include it in FormData
        const response = await apiRequest("post", "/restaurant/update", formData, {}, {
            // no need to set Content-Type header, axios handles it automatically for FormData
        });
        return response?.data?.data || null;
    } catch (error) {
        console.error("Error updating restaurant profile:", error);
        return null;
    }
};

export const fetchVendorDetails = async (
    vendor_id: string
): Promise<Restaurant | null> => {
    try {
        const payload = { vendor_id };
        const response = await apiRequest("post", "/vendor/get", payload);
        return response?.data?.data || null;
    } catch (error) {
        console.error("Error fetching restaurant details:", error);
        return null;
    }
};

export const updateVendorProfile = async (
    profileData: Record<string, any> // Plain object
): Promise<Restaurant | null> => {
    try {
        const response = await apiRequest("post", "/vendor/update-profile", {
            ...profileData,
        });
        return response?.data?.data || null;
    } catch (error) {
        console.error("Error updating restaurant profile:", error);
        return null;
    }
};

export const deleteRestaurantAsset = async ({
  restaurantId,
  index,
}: {
  restaurantId: string;
  index: number;
}) => {
  try {
    const payload = { restaurantId, index };
    const response = await apiRequest("post", "/restaurant/delete-restaurant-asset", payload);
    return response?.data;
  } catch (error) {
    console.error("Error deleting asset:", error);
    throw error;
  }
};
