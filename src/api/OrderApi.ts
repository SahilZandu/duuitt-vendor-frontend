import apiRequest from "./apiInstance";

export type Order = {
    order_id: string;
    _id: string;
    invoice_no: string;
    status: "completed" | "declined" | "pending";
    createdAt: string;
    updatedAt: string;
    total_amount: number;
    payment_method_id: string;
    customer: {
        _id: string;
        name: string;
        email?: string;
        phone?: string;
    };
    order_items: Array<{
        _id: string;
        product_name: string;
        quantity: number;
        price: number;
    }>;
    restaurant_id: string;
};

type FetchOrdersParams = {
    restaurant_id: string;
    status: "all" | "completed" | "declined";
    search?: string;
    limit?: number;
};
type OrderStatusPayload = {
    food_order_id: string;
    status: "cooking" | "packing_processing" | "ready_to_pickup" | "declined";
    cooking_time?: string; // Optional
};
// fetch order by status
export const fetchOrdersByStatus = async ({
    restaurant_id,
    status,
    search,
    limit = 10,
}: FetchOrdersParams): Promise<Order[]> => {
    const payload: Record<string, any> = {
        restaurant_id,
        status,
        limit,
    };

    if (search) payload.search = search;

    const response = await apiRequest("post", "/food-order/get-order-history", payload);
    console.log("response from food order----", response);
    console.log("Returned records count:", response?.data?.data?.length);
    return response?.data?.data || [];
};

// fetch order by id for single order details view
export const fetchOrderById = async (order_id: string): Promise<Order | null> => {
    try {
        const payload = { order_id };
        const response = await apiRequest("post", "/food-order/get-order-id-wise-details", payload);
        return response?.data?.data || null;
    } catch (error) {
        console.error("Error fetching order by ID:", error);
        return null;
    }
};

// fetch waiting orders
export const fetchWaitingOrders = async (restaurant_id: string): Promise<Order[]> => {
    try {
        const payload = { restaurant_id };
        const response = await apiRequest("post", "/food-order/get-waiting-order", payload);
        console.log("response from waiting orders ----", response);
        return response?.data?.data || [];
    } catch (error) {
        console.error("Error fetching waiting orders:", error);
        return [];
    }
};

export const getOrderStatus = async (
    params: { restaurant_id: string; status: "all" | "cooking" | "ready_to_pickup" | 'packing_processing' }
): Promise<Order[]> => {
    try {
        const response = await apiRequest("post", "/food-order/get-order-by-status", params);
        return response?.data?.data || [];
    } catch (error) {
        console.error("Error fetching orders by status:", error);
        return [];
    }
};

// Mark order as ready for pickup
export const updateOrderStatus = async (payload: OrderStatusPayload): Promise<boolean> => {
    try {
        const response = await apiRequest("post", "/food-order/update-order-status", payload);
        console.log({response});
        
        return response?.data;
    } catch (error) {
        console.error("Error updating order status:", error);
        return false;
    }
};
