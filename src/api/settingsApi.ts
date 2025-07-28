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

// Unified order fetcher
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