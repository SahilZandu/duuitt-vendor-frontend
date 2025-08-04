import apiRequest from "./apiInstance";

export interface TimeSlotEntry {
  open_times: string;      // e.g., "08:41"
  close_time: string;      // e.g., "10:41"
  days_of_week: number;    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  is_edit_delete: boolean;
}

export interface AllDaysTiming {
  outlet_status: boolean;
  timings: TimeSlotEntry[];
}

export interface SpecifiedDayTiming {
  outlet_status: boolean;
  timings: TimeSlotEntry[];
}

export interface RestaurantTimingPayload {
  vendor_id: string;
  restaurant_id: string;
  timings: {
    is_all_day: boolean;
    all_days: AllDaysTiming;
    specified: SpecifiedDayTiming[]; // length 7 (Sun-Sat)
  };
}

export interface RestaurantTimingResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const addRestaurantTimings = async (
  payload: RestaurantTimingPayload
): Promise<RestaurantTimingResponse> => {
  const response = await apiRequest("post", "/restaurant/add-restaurant-timings", payload);
  return response?.data;
};

// .............Update time slot...............
export interface UpdateRestaurantTimingPayload {
  restaurant_id: string;
  timing_id: string;
  open_times: string;  // e.g., "02:00"
  close_time: string;  // e.g., "05:00"
}

export interface UpdateRestaurantTimingResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const updateRestaurantTiming = async (
  payload: UpdateRestaurantTimingPayload
): Promise<UpdateRestaurantTimingResponse> => {
  const response = await apiRequest("post", "/restaurant/update-restaurant-timings", payload);
  console.log({response});
  
  return response?.data;
};

// ..........delete time slot...........
export interface DeleteRestaurantTimingPayload {
  restaurant_id: string;
  day_of_week: number;
  index: number;
  is_all_day: boolean;
}

export interface DeleteRestaurantTimingResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const deleteRestaurantTiming = async (
  payload: DeleteRestaurantTimingPayload
): Promise<DeleteRestaurantTimingResponse> => {
  const response = await apiRequest("post", "/restaurant/delete-restaurant-timings", payload);
  console.log({ response });
  return response?.data;
};
