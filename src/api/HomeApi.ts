import apiRequest from "./apiInstance";

export const fetchAllData = async (restaurant_id: string) => {
    try {
        const payload = { restaurant_id };
        const response = await apiRequest("post", "/restaurant/dashboard", payload);
        console.log("response from waiting orders ----", response);
        return response?.data || [];
    } catch (error) {
        console.error("Error fetching waiting orders:", error);
        return [];
    }
};