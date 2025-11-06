import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FormatDate from "../../../../components/Ui/FormatDate";
import MenuIcon from "../../../../lib/MenuIcon";
import { fetchOrderById } from "../../../../api/OrderApi";
import PageTitle from "../../../../components/Ui/PageTitle";
import Loader from "../../../../components/loader/Loader";
import Tooltip from "../../../../components/Ui/Tooltip"
// Status Label Mapping
const statusLabel = {
  waiting_for_confirmation: "New",
  cooking: "Preparing",
  packing_processing: "Packing",
  ready_to_pickup: "Ready for Pickup",
  completed: "Completed",
  declined: "Declined",
} as const;

type CartItem = {
  food_item_name: string;
  quantity: number;
  food_item_price: number;
  veg_non_veg: string;
  instructions?: string;
  selected_add_on : [Addon];
  varient_price : number;
  add_on_amount : number;
  food_item_image : string;
  varient_name : string;
};

type deliveryDetails = {
  address: string;
  address_detail?: string;
  // geo_location?: { lat: number; lng: number };
  landmark?: string;
  location_id?: string;
  _id?: string;
  name: string;
  phone: string;
  title: string;
};

 type Addon = {
  addon_name: string;
  addon_price: number;
  addon_quantity: number;
};

type OrderType = {
  order_id: string;
  user_name: string;
  status: keyof typeof statusLabel;
  createdAt: string;
  cartitems: CartItem[];
  total_amount: number;
  restaurant_charge_amount?: number;
  gst_percentage?: number;
  packing_fee?: number;
  platform_fee?: number;
  after_discount_sub_amt?: number;
  distance_from_customer?: number;
  coupon_amount?: number;
  delivery_fee?: number;
  original_total_amount?: number;
  payment_status?: string;
  delivery_address: deliveryDetails;
};

const ViewOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderType | null>(null);
  const [deliveryDetails, setDeliveryDetails] = useState<deliveryDetails>();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const getOrder = async () => {
    try {
      setLoading(true);
      const data = await fetchOrderById(id!);
      console.log("order data:", data);
      console.log("delivery details : ", data?.delivery_address);
      setOrder(data as OrderType);
      setDeliveryDetails(data?.delivery_address);
    } catch (err) {
      console.error("Failed to fetch order:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) getOrder();
  }, [id]);

  const handleRedirectToBack = () => {
    if (location.pathname.includes("order-history")) {
      navigate("/outlet/order-history");
    } else {
      navigate("/orders");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <button
        onClick={handleRedirectToBack}
        className="mb-3 inline-flex items-center gap-2 text-sm text-gray-700 hover:text-black transition"
      >
        <span className="text-lg">←</span> Back
      </button>

      {/* Page Title */}
      <PageTitle title="Order Details" />

      {/* Main Two-Column Layout */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE — Order Details */}
        <div className="col-span-2 bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                #{order?.order_id}
              </h2>
              <p className="text-sm text-gray-500">
                {order?.createdAt && <FormatDate isoDate={order.createdAt} />}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
                ${
                  order?.status === "cooking"
                    ? "bg-green-100 text-green-700"
                    : order?.status === "ready_to_pickup"
                    ? "bg-orange-100 text-orange-700"
                    : order?.status === "packing_processing"
                    ? "bg-blue-100 text-blue-700"
                    : order?.status === "declined"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-600"
                }`}
            >
              {order?.status && statusLabel[order.status]}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-between mt-5 mb-6 text-xs text-gray-500 relative">
            {["Ordered", "Preparing", "Packed", "Out for Delivery"].map(
              (step, i) => (
                <div key={i} className="flex flex-col items-center w-full">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      i <=
                      [
                        "waiting_for_confirmation",
                        "cooking",
                        "packing_processing",
                        "ready_to_pickup",
                        "completed"
                      ].indexOf(order?.status || "")
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  />
                  <span className="mt-1">{step}</span>
                </div>
              )
            )}
            <div className="absolute top-[3px] left-0 w-full h-[2px] bg-gray-200 -z-10"></div>
          </div>


 {/* Ordered Items Table */}
<h3 className="font-semibold text-gray-800 mt-6 mb-3">Ordered Items</h3>

<div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
  <table className="min-w-full text-sm text-gray-700">
    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
      <tr>
        <th className="px-4 py-3 text-left">Item</th>
        <th className="px-4 py-3 text-left">Variant</th>
        <th className="px-4 py-3 text-left">Add-ons</th>
        <th className="px-4 py-3 text-center">Qty</th>
        <th className="px-4 py-3 text-right">Price</th>
        <th className="px-4 py-3 text-right">Total</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-100">
      {order?.cartitems?.map((item, idx) => {
        const hasAddons = item.selected_add_on && item.selected_add_on.length > 0;
        const itemTotal =
          (item.varient_price || item.food_item_price) * item.quantity +
          (item.add_on_amount || 0);

        return (
          <tr key={idx} className="hover:bg-gray-50 transition">
            {/* Item Name */}
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                {item.food_item_image && (
                  <img
                    src={item.food_item_image}
                    alt={item.food_item_name}
                    className="w-10 h-10 object-cover rounded-md border"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <MenuIcon
                      name={
                        item.veg_non_veg.toLowerCase() === "veg" ? "veg" : "nonVeg"
                      }
                    />
                    <p className="font-medium text-gray-800">
                      {item.food_item_name}
                    </p>
                  </div>
                </div>
              </div>
            </td>

            {/* Variant */}
            <td className="px-4 py-3 text-gray-700">
              {item.varient_name ? (
                <span className="inline-block bg-purple-50 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                  {item.varient_name}{" "}
                  {item.varient_price && `(₹${item.varient_price})`}
                </span>
              ) : (
                <span className="text-gray-400 text-xs italic">—</span>
              )}
            </td>

            {/* Add-ons */}
            <td className="px-4 py-3 text-gray-700">
              {hasAddons ? (
                <ul className="space-y-1">
                  {item.selected_add_on.map((addon : Addon, i : number) => (
                    <li
                      key={i}
                      className="flex justify-between text-xs text-gray-700"
                    >
                      <span>{addon.addon_name} × {addon.addon_quantity}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-400 text-xs italic">—</span>
              )}
            </td>

            {/* Quantity */}
            <td className="px-4 py-3 text-center font-medium text-gray-800">
              {item.quantity}
            </td>

            {/* Price */}
            <td className="px-4 py-3 text-right text-gray-800">
              ₹{(item.varient_price || item.food_item_price).toFixed(2)}
            </td>

            {/* Total + Tooltip */}
            <td className="px-4 py-3 text-right font-semibold text-gray-900">
              ₹{itemTotal.toFixed(2)}

              {hasAddons && (
                <Tooltip
                  position="right"
                  text={
                    <div className="text-left space-y-1">
                      <p className="font-semibold text-gray-50 mb-1">
                        Price Breakdown:
                      </p>
                      <p className="text-gray-50">
                        Base Price: ₹
                        {(item.varient_price || item.food_item_price).toFixed(2)} ×{" "}
                        {item.quantity}
                      </p>
                      {item.selected_add_on.map((addon, i) => (
                        <p key={i} className="text-gray-50">
                          {addon.addon_name}: ₹{addon.addon_price.toFixed(2)} ×{" "}
                          {addon.addon_quantity}
                        </p>
                      ))}
                      <p className="border-t border-gray-600 mt-2 pt-1 font-semibold text-gray-50">
                        Total: ₹{itemTotal.toFixed(2)}
                      </p>
                    </div>
                  }
                >
                  <span className="ml-1 text-gray-400 font cursor-pointer">
                    (!)
                  </span>
                </Tooltip>
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>




          {/* Bill Summary */}
           <h3 className="font-semibold text-gray-800 mt-6 mb-2">
             Bill Summary
           </h3>
           <div className="space-y-1 text-sm text-gray-700">
            {[
              { label: "Item Total", value: order?.after_discount_sub_amt },
              { label: "Restaurant Charges", value: order?.restaurant_charge_amount },
              { label: "Management Charges", value: order?.distance_from_customer },
              { label: "Packing Charges", value: order?.packing_fee },
              { label: "Platform Fee", value: order?.platform_fee },
              { label: "Discount", value: order?.coupon_amount, isDiscount: true },
              { label: "Delivery Charges", value: order?.delivery_fee },
            ].map((row, i) => (
              <div key={i} className="flex justify-between">
                <span>{row.label}</span>
                <span className={`${row.isDiscount ? "text-green-600" : ""}`}>
                  ₹{Number(row.value || 0).toFixed(2)}
                </span>
              </div>
            ))}
           </div>

          {/* Total */}
           <div className="flex justify-between text-lg font-bold mt-4 pt-3 border-t border-dashed">
            <span>Grand Total</span>
            <span>₹{Number(order?.original_total_amount || 0).toFixed(2)}</span>
           </div>

          {/* Payment */}
           <div className="flex justify-between items-center mt-4">
            <span className="text-sm font-medium">
              Payment{" "}
              <span
                className={`px-2 py-1 ml-2 rounded text-xs font-semibold ${
                  order?.payment_status === "captured"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order?.payment_status === "captured" ? "Paid" : "Pending"}
              </span>
            </span>
            <span className="font-semibold text-gray-800">
              ₹{Number(order?.total_amount || 0).toFixed(2)}
            </span>
           </div>
        </div>
       {/* RIGHT SIDE — Delivery Details */}
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 h-fit space-y-6">
  {/* Title */}
  <div className="flex items-center gap-2 border-b pb-3">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-purple-600"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7zM10 11a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
    <h3 className="text-lg font-semibold text-gray-900">Delivery Details</h3>
  </div>

  {/* Customer Info */}
  <div className="bg-gray-50 rounded-xl p-4">
    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
      👤 Customer Info
    </h4>
    <ul className="text-sm text-gray-700 space-y-1">
      <li>
        <span className="font-medium">Name:</span> {deliveryDetails?.name || "N/A"}
      </li>
      <li>
        <span className="font-medium">Phone:</span> {deliveryDetails?.phone || "N/A"}
      </li>
      {deliveryDetails?.address_detail && (
        <li>
          <span className="font-medium">Label:</span> {deliveryDetails.address_detail}
        </li>
      )}
    </ul>
  </div>

  {/* Address Info */}
  <div className="bg-gray-50 rounded-xl p-4">
    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
      🏠 Delivery Address
    </h4>
    <ul className="text-sm text-gray-700 space-y-1">
      <li className="leading-snug">
        {deliveryDetails?.address || "No address provided"}
      </li>
      {deliveryDetails?.landmark && (
        <li>
          <span className="font-medium">Landmark:</span> {deliveryDetails.landmark}
        </li>
      )}
      {deliveryDetails?.title && (
        <li>
          <span className="font-medium">Address Type:</span> {deliveryDetails.title}
        </li>
      )}
    </ul>
  </div>

  {/* Payment Summary */}
  <div className="bg-gray-50 rounded-xl p-4">
    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
      💳 Payment Summary
    </h4>
    <ul className="text-sm text-gray-700 space-y-1">
      <li>
        <span className="font-medium">Method:</span>{" "}
        {order?.payment_status === "captured" ? "Online" : "COD"}
      </li>
      <li>
        <span className="font-medium">Status:</span>{" "}
        <span
          className={`${
            order?.payment_status === "captured"
              ? "text-green-600"
              : "text-yellow-600"
          }`}
        >
          {order?.payment_status === "captured" ? "Paid" : "Pending"}
        </span>
      </li>
      <li>
        <span className="font-medium">Amount:</span> ₹
        {Number(order?.total_amount || 0).toFixed(2)}
      </li>
    </ul>
  </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;
