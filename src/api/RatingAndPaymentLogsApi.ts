import apiRequest from "./apiInstance";
interface RatingResponse {
  overall_review: {
    food_rating?: number;
    taste_rating?: number;
    packaging_rating?: number;
    value_rating?: number;
  };
  data: {
    _id: string;
    customer?: {
      name?: string;
      profile_pic?: string;
    };
    food_review?: string;
    food_rating?: number;
    taste_rating?: number;
    packaging_rating?: number;
    value_rating?: number;
    images?: string[];
    order?: {
      cart_items: {
        food_item_id: string;
        food_item_name?: string;
        quantity: number;
        food_item_price: number;
      }[];
    };
  }[];
}
interface PaymentLog {
  _id: string;
  payment_type: "captured" | "refund" | "withdraw"; // or extend as needed
  amount: number;
  date: string; // or Date if parsing
  status: string;
  order_id?: string;
  payment_method?: string;
  customer_name?: string;
  [key: string]: any; // for flexibility
}

type GroupedPaymentLogsResponse = {
  title: string;
  data: PaymentLog[];
}[];

export const fetchRestaurantReviews = async ({
  restaurant_id,
  limit,
}: {
  restaurant_id: string;
  limit: number;
}): Promise<RatingResponse> => {
  const payload = { restaurant_id, limit };
  const response = await apiRequest("post", "/reviews/restaurant-food-reviews", payload);
  return response?.data?.data;
};

export const fetchRestaurantPaymentLogs = async ({
  restaurant_id,
  search = "",
  status = "all",
}: {
  restaurant_id: string;
  search?: string;
  status?: "all" | "captured" | "refund" | "withdraw";
}): Promise<GroupedPaymentLogsResponse> => {
  const payload = { restaurant_id, search, status };
  const response = await apiRequest("post", "/food-order/get-restaurant-payment-collection-logs", payload);
  return response?.data?.data;
};