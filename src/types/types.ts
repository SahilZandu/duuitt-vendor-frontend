// ---------- types.ts ----------
export interface TimeSlotEntry {
  _id: string;
  open_times: string;   // e.g. "08:00"
  close_time: string;   // e.g. "12:00"
  is_edit_delete: boolean;
  days_of_week: number; // 0 = Sunday, 1 = Monday, ...
}

export interface AllDaysTiming {
  outlet_status: boolean;
  timings: TimeSlotEntry[];
}

export interface SpecifiedDayTiming {
  outlet_status: boolean;
  timings: TimeSlotEntry[];
}

export interface RestaurantTiming {
  is_all_day: boolean;
  all_days: AllDaysTiming;
  specified: SpecifiedDayTiming[]; // length = 7
}
export type AllDaysTimingPayload = {
  outlet_status: boolean;
  timings: TimeSlotPayload[];
};
export type SpecifiedDayTimingPayload = Omit<SpecifiedDayTiming, 'timings'> & {
  timings: TimeSlotPayload[];
};
export interface RestaurantTimingPayload {
  vendor_id: string;
  restaurant_id: string;
  timings: {
    is_all_day: boolean;
    all_days: AllDaysTimingPayload;
    specified: SpecifiedDayTimingPayload[];
  };
}

export interface Slot {
  id: number;
  from: string;
  to: string;
  is_edit_delete: boolean;
  timing_id?: string;
  isNew?: boolean;
}

export interface EditingSlot {
  slotIndex: number;
  slotData: Slot;
}

// vendor hook must reflect these types too:
export interface Vendor {
  restaurant?: {
    timings?: RestaurantTiming;
  };
}
export type TimeSlotPayload = Omit<TimeSlotEntry, '_id'>;

export type OrderStatus =
  | "pending"
  | "waiting_for_confirmation"
  | "cooking"
  | "packing_processing"
  | "ready_to_pickup"
  | "declined"
  | "completed";
export type CartItem = {
  food_item_name: string;
  quantity: number;
  food_item_price: number;
  veg_non_veg: string;
  instructions?: string;
};

export type OrderType = {
  order_id: string;
  user_name: string;
  status: "waiting_for_confirmation" | "cooking" | "packing_processing" | "ready_to_pickup" | "declined" | "completed";
  createdAt: string;
  cartitems: CartItem[];
  total_amount: number;
  restaurant_charge_amount?: number;
  gst_percentage?: number;
  packing_fee?: number;
  platform_fee?: number;
};

type VariantGroup = {
  group: string;
  variant: {
      _id: string;
      name: string;
  }[];
};

type AddonGroup = {
  group: string;
  max_selection: number;
  is_price_related: boolean;
  addon: {
      _id: string;
      name: string;
      price?: number;
  }[];
};


export type FoodItem = {
  _id: string;
  name: string;
  image?: string;
  description?: string;
  selling_price?: number;
  tag?: string;
  in_stock:number;
  veg_nonveg?: "veg" | "nonveg"|"egg";
  variants?: VariantGroup[];
  addon?: AddonGroup[];
};
