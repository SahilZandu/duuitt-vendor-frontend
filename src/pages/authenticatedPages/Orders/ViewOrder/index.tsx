import { useEffect, useState, useCallback } from "react";
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

  const getOrder = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    if (id) getOrder();
  }, [id, getOrder]);

  const handleRedirectToBack = () => {
    if (location.pathname.includes("order-history")) {
      navigate("/outlet/order-history");
    } else {
      navigate("/orders");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Back Button */}
        <button
          onClick={handleRedirectToBack}
          className="group mb-4 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Page Title */}
        <PageTitle title="Order Details" />

        {/* Main Two-Column Layout */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDE — Order Details */}
          <div className="col-span-2 bg-white shadow-lg rounded-2xl p-6 sm:p-8 border border-gray-200/50 backdrop-blur-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pb-6 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-blue-600">#</span>{order?.order_id}
              </h2>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {order?.createdAt && <FormatDate isoDate={order.createdAt} />}
              </p>
            </div>

            <span
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize shadow-sm border-2 transition-all
                ${
                  order?.status === "cooking"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : order?.status === "ready_to_pickup"
                    ? "bg-orange-50 text-orange-700 border-orange-200"
                    : order?.status === "packing_processing"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : order?.status === "declined"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : order?.status === "completed"
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : "bg-gray-50 text-gray-600 border-gray-200"
                }`}
            >
              {order?.status && statusLabel[order.status]}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="py-6">
            <div className="flex items-center justify-between text-xs font-medium text-gray-600 relative">
              {["Ordered", "Preparing", "Packed", "Out for Delivery"].map(
                (step, i) => {
                  const currentStep = [
                    "waiting_for_confirmation",
                    "cooking",
                    "packing_processing",
                    "ready_to_pickup",
                    "completed"
                  ].indexOf(order?.status || "");
                  const isActive = i <= currentStep;
                  const isCompleted = i < currentStep;

                  return (
                    <div key={i} className="flex flex-col items-center w-full z-10">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 shadow-sm ${
                          isActive
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-4 ring-blue-100"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {isCompleted ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-xs font-bold">{i + 1}</span>
                        )}
                      </div>
                      <span className={`mt-1 text-center ${isActive ? 'text-gray-700 font-semibold' : 'text-gray-400'}`}>{step}</span>
                    </div>
                  );
                }
              )}
              <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-0">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                  style={{
                    width: `${([
                      "waiting_for_confirmation",
                      "cooking",
                      "packing_processing",
                      "ready_to_pickup",
                      "completed"
                    ].indexOf(order?.status || "") / 4) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>


 {/* Ordered Items Table */}
<div className="mt-8">
  <div className="flex items-center gap-2 mb-4">
    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    <h3 className="text-lg font-bold text-gray-900">Ordered Items</h3>
  </div>

<div className="overflow-x-auto rounded-xl border border-gray-200 shadow-md bg-white">
  <table className="min-w-full text-sm text-gray-700">
    <thead className="bg-gradient-to-r from-gray-50 to-blue-50/30 text-gray-700 uppercase text-xs font-bold border-b-2 border-gray-200">
      <tr>
        <th className="px-6 py-4 text-left">Item</th>
        <th className="px-6 py-4 text-left">Variant</th>
        <th className="px-6 py-4 text-left">Add-ons</th>
        <th className="px-6 py-4 text-center">Qty</th>
        <th className="px-6 py-4 text-right">Price</th>
        <th className="px-6 py-4 text-right">Total</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-100">
      {order?.cartitems?.map((item, idx) => {
        const hasAddons = item.selected_add_on && item.selected_add_on.length > 0;
        const itemTotal =
          (item.varient_price || item.food_item_price) * item.quantity +
          (item.add_on_amount || 0);

        return (
          <tr key={idx} className="hover:bg-blue-50/30 transition-colors duration-150">
            {/* Item Name */}
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                {item.food_item_image && (
                  <img
                    src={item.food_item_image}
                    alt={item.food_item_name}
                    className="w-14 h-14 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                  />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <MenuIcon
                      name={
                        item.veg_non_veg.toLowerCase() === "veg" ? "veg" : "nonVeg"
                      }
                    />
                    <p className="font-semibold text-gray-900">
                      {item.food_item_name}
                    </p>
                  </div>
                </div>
              </div>
            </td>

            {/* Variant */}
            <td className="px-6 py-4 text-gray-700">
              {item.varient_name ? (
                <span className="inline-block bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-purple-200">
                  {item.varient_name}{" "}
                  {item.varient_price && `(₹${item.varient_price})`}
                </span>
              ) : (
                <span className="text-gray-400 text-xs italic">—</span>
              )}
            </td>

            {/* Add-ons */}
            <td className="px-6 py-4 text-gray-700">
              {hasAddons ? (
                <ul className="space-y-1.5">
                  {item.selected_add_on.map((addon : Addon, i : number) => (
                    <li
                      key={i}
                      className="text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded"
                    >
                      <span className="font-medium">{addon.addon_name}</span> × {addon.addon_quantity}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-400 text-xs italic">—</span>
              )}
            </td>

            {/* Quantity */}
            <td className="px-6 py-4 text-center">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 font-bold rounded-lg text-sm">
                {item.quantity}
              </span>
            </td>

            {/* Price */}
            <td className="px-6 py-4 text-right font-semibold text-gray-900">
              ₹{(item.varient_price || item.food_item_price).toFixed(2)}
            </td>

            {/* Total + Tooltip */}
            <td className={`px-6 py-4 text-right ${hasAddons ? ('flex justify-end items-center gap-1'): ('')}`}>
              <span className="font-bold text-gray-900 text-base">₹{itemTotal.toFixed(2)}</span>

              {hasAddons && (
                <Tooltip
                  position="right"
                  text={
                    <div className="text-left space-y-1.5">
                      <p className="font-bold text-white mb-2 text-sm border-b border-gray-500 pb-2">
                        Price Breakdown
                      </p>
                      <p className="text-gray-100 text-sm">
                        Base Price: ₹
                        {(item.varient_price || item.food_item_price).toFixed(2)} × {item.quantity}
                      </p>
                      {item.selected_add_on.map((addon, i) => (
                        <p key={i} className="text-gray-100 text-sm">
                          {addon.addon_name}: ₹{addon.addon_price.toFixed(2)} × {addon.addon_quantity}
                        </p>
                      ))}
                      <p className="border-t border-gray-500 mt-2 pt-2 font-bold text-white text-sm">
                        Total: ₹{itemTotal.toFixed(2)}
                      </p>
                    </div>
                  }
                >
                  <span className="ml-1 text-blue-600 hover:text-blue-700 cursor-pointer transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
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
</div>

          {/* Bill Summary */}
          <div className="mt-8 bg-gradient-to-br from-gray-50 to-blue-50/20 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-bold text-gray-900">Bill Summary</h3>
            </div>
           <div className="space-y-2.5 text-sm text-gray-700">
            {[
              { label: "Item Total", value: order?.after_discount_sub_amt },
              { label: "Restaurant Charges", value: order?.restaurant_charge_amount },
              { label: "Management Charges", value: order?.distance_from_customer },
              { label: "Packing Charges", value: order?.packing_fee },
              { label: "Platform Fee", value: order?.platform_fee },
              { label: "Discount", value: order?.coupon_amount, isDiscount: true },
              { label: "Delivery Charges", value: order?.delivery_fee },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center py-1.5 px-3 rounded-lg hover:bg-white/50 transition-colors">
                <span className="font-medium text-gray-700">{row.label}</span>
                <span className={`font-semibold ${row.isDiscount ? "text-green-600" : "text-gray-900"}`}>
                  {row.isDiscount && row.value ? "-" : ""}₹{Number(row.value || 0).toFixed(2)}
                </span>
              </div>
            ))}
           </div>

          {/* Total */}
           <div className="flex justify-between items-center text-lg font-bold mt-4 pt-4 border-t-2 border-dashed border-gray-300 bg-white rounded-lg px-3 py-3">
            <span className="text-gray-900">Grand Total</span>
            <span className="text-blue-600 text-xl">₹{Number(order?.original_total_amount || 0).toFixed(2)}</span>
           </div>

          {/* Payment */}
           <div className="flex justify-between items-center mt-4 bg-white rounded-lg px-3 py-3 border border-gray-200">
            <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Payment
              <span
                className={`px-3 py-1 ml-1 rounded-lg text-xs font-bold ${
                  order?.payment_status === "captured"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-yellow-100 text-yellow-700 border border-yellow-200"
                }`}
              >
                {order?.payment_status === "captured" ? "Paid" : "Pending"}
              </span>
            </span>
            <span className="font-bold text-gray-900 text-lg">
              ₹{Number(order?.total_amount || 0).toFixed(2)}
            </span>
           </div>
          </div>
          </div>

          {/* RIGHT SIDE — Delivery Details */}
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200/50 h-fit space-y-5 backdrop-blur-sm">
  {/* Title */}
  <div className="flex items-center gap-2 border-b-2 border-gray-100 pb-4">
    <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-purple-700"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7zM10 11a2 2 0 110-4 2 2 0 010 4z" />
      </svg>
    </div>
    <h3 className="text-lg font-bold text-gray-900">Delivery Details</h3>
  </div>

  {/* Customer Info */}
  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-5 border border-blue-200 shadow-sm">
    <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
      Customer Info
    </h4>
    <ul className="text-sm text-gray-700 space-y-2.5">
      <li className="flex items-start gap-2">
        <span className="font-semibold text-gray-600 min-w-[60px]">Name:</span>
        <span className="font-medium text-gray-900">{deliveryDetails?.name || "N/A"}</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="font-semibold text-gray-600 min-w-[60px]">Phone:</span>
        <span className="font-medium text-gray-900">{deliveryDetails?.phone || "N/A"}</span>
      </li>
      {deliveryDetails?.address_detail && (
        <li className="flex items-start gap-2">
          <span className="font-semibold text-gray-600 min-w-[60px]">Label:</span>
          <span className="font-medium text-gray-900">{deliveryDetails.address_detail}</span>
        </li>
      )}
    </ul>
  </div>

  {/* Address Info */}
  <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-5 border border-green-200 shadow-sm">
    <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
      Delivery Address
    </h4>
    <ul className="text-sm text-gray-700 space-y-2.5">
      <li className="leading-relaxed font-medium text-gray-900 bg-white/60 p-2 rounded-lg">
        {deliveryDetails?.address || "No address provided"}
      </li>
      {deliveryDetails?.landmark && (
        <li className="flex items-start gap-2">
          <span className="font-semibold text-gray-600">Landmark:</span>
          <span className="font-medium text-gray-900">{deliveryDetails.landmark}</span>
        </li>
      )}
      {deliveryDetails?.title && (
        <li className="flex items-start gap-2">
          <span className="font-semibold text-gray-600">Type:</span>
          <span className="inline-block bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded-lg">
            {deliveryDetails.title}
          </span>
        </li>
      )}
    </ul>
  </div>

  {/* Payment Summary */}
  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-5 border border-purple-200 shadow-sm">
    <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
      Payment Summary
    </h4>
    <ul className="text-sm text-gray-700 space-y-2.5">
      <li className="flex items-center justify-between bg-white/60 p-2 rounded-lg">
        <span className="font-semibold text-gray-600">Method:</span>
        <span className="font-bold text-gray-900">
          {order?.payment_status === "captured" ? "Online" : "COD"}
        </span>
      </li>
      <li className="flex items-center justify-between bg-white/60 p-2 rounded-lg">
        <span className="font-semibold text-gray-600">Status:</span>
        <span
          className={`font-bold px-3 py-1 rounded-lg text-xs ${
            order?.payment_status === "captured"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-yellow-100 text-yellow-700 border border-yellow-200"
          }`}
        >
          {order?.payment_status === "captured" ? "Paid" : "Pending"}
        </span>
      </li>
      <li className="flex items-center justify-between bg-white/60 p-2 rounded-lg">
        <span className="font-semibold text-gray-600">Amount:</span>
        <span className="font-bold text-purple-700 text-lg">
          ₹{Number(order?.total_amount || 0).toFixed(2)}
        </span>
      </li>
    </ul>
  </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;
