import React, { useEffect, useState } from "react";
import { fetchAllData } from "../../../api/HomeApi";
import MenuIcon from "../../../lib/MenuIcon";
import Loader from "../../../components/loader/Loader";
import OrderCard from "../../../components/Ui/OrderCard";
import type { OrderStatus } from "../../../types/types";
interface DashboardData {
  orders: {
    total: number;
    completed: number;
    declined: number;
    ready_to_pickup: number;
  };
  teamMembers: number;
  revenue: {
    total_revenue: number;
    gst_collection: number;
    restaurant_charge_total: number;
  };
  orderDetails: any[]; // replace `any` with actual order item type if you have
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const restaurantId = localStorage.getItem("restaurant_id") || "";
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetchAllData(restaurantId);
      setData(response?.data);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchDashboardData();
  }, [])
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "cooking":
        return "bg-orange-500";
      case "ready_to_pickup":
      case "packing_processing": case "completed":
        return "bg-green-500";
      case "waiting_for_confirmation":
        return "bg-blue-500";
      case "declined":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };
  if (loading) {
    return (
      <Loader />
    )
  }
  return (
    <div className="p-6  min-h-screen">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          {
            label: "Total Orders",
            value: `${data?.orders?.total || 0}`,
            color: "blue",
            icon: "order",
          },
          {
            label: "Completed Orders",
            value: `${data?.orders?.completed || 0}`,
            color: "green",
            icon: "ready",
          },
          {
            label: "Declined Orders",
            value: `${data?.orders?.declined || 0}`,
            color: "red",
            icon: "close",
          },
          // {
          //   label: "Ready To Pickup Orders",
          //   value: `${data?.orders?.ready_to_pickup || 0}`,
          //   color: "amber",
          //   icon: "pickup",
          // },
          {
            label: "Team Members",
            value: `${data?.teamMembers || 0}`,
            color: "blue",
            icon: "team",
          },
          {
            label: "Total Revenue",
            value: `₹${data?.revenue?.total_revenue?.toFixed(2) || "0.00"}`,
            color: "blue",
            icon: "rs",
          },
          // {
          //   label: "GST Collection",
          //   value: `₹${data?.revenue?.gst_collection?.toFixed(2) || "0.00"}`,
          //   color: "fuchsia",
          //   icon: "gst",
          // },
          // {
          //   label: "Restaurant Total Charge",
          //   value: `₹${data?.revenue?.restaurant_charge_total?.toFixed(2) || "0.00"}`,
          //   color: "blue",
          //   icon: "restaurant",
          // },
        ].map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-[35px] shadow-md border border-gray-200 flex items-center gap-4"
          >
            {/* Icon Circle */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full bg-${card.color}-100 text-${card.color}-600`}
            >
              <MenuIcon name={card.icon || "info"} className="w-5 h-5" />
            </div>

            {/* Text (value + label) */}
            <div className="flex flex-col">
              <p className="text-[35px] font-semibold text-gray-900 leading-tight">
                {card.value}
              </p>
              <p className="text-sm text-gray-500 leading-none">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Orders */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-bold mb-4">New Orders</h2>
          <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-auto">
            {data?.orderDetails?.map((order: any) => (
              <div key={order?._id} onClick={() => setSelectedOrder(order)} className="cursor-pointer">
                <OrderCard order={order}
                  key={order?._id}
                  onStatusChange={() => { }}
                  onReject={async (orderId: string) => {
                    console.log("Rejected order:", orderId);
                  }}
                  activeTab={"new"} />
              </div>
            ))}
          </div>
        </div>
        {/* Order Details */}
        <div className="bg-white rounded-xl p-4 shadow-md min-h-[300px]">
          <h2 className="text-lg font-bold mb-4">Order Details</h2>
          {selectedOrder ? (
            <div className="space-y-4 text-sm text-gray-700">
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Invoice No:</strong> {selectedOrder?.invoice_no}</div>
                <div><strong>Order ID:</strong> {selectedOrder?.order_id}</div>
                <div><strong>Transaction ID:</strong> {selectedOrder?.transaction_id}</div>
                <div><strong>Status:</strong> <span className={`capitalize px-2 py-1 rounded-[20px] text-white ${getStatusColor(selectedOrder.status)}`}>{selectedOrder?.status}</span></div>
                <div><strong>Verification Code:</strong> {selectedOrder?.verification_code}</div>
                <div><strong>Cooking Time:</strong> {selectedOrder?.cooking_time}</div>
                <div><strong>Distance (km):</strong> {selectedOrder?.distance_from_customer}</div>
                <div><strong>Delivery Time:</strong> {new Date(selectedOrder?.delivery_time).toLocaleString()}</div>
              </div>

              <hr />

              <div>
                <strong>Customer Info</strong>
                <div className="mt-1">
                  <p><strong>Name:</strong> {selectedOrder?.delivery_address?.name}</p>
                  <p><strong>Phone:</strong> {selectedOrder?.delivery_address?.phone}</p>
                  <p><strong>Address:</strong> {selectedOrder?.delivery_address?.address}, {selectedOrder?.delivery_address?.landmark}</p>
                  <p><strong>Title:</strong> {selectedOrder?.delivery_address?.title}</p>
                </div>
              </div>

              <hr />

              <div>
                <strong>Items Ordered</strong>
                <div className="space-y-2 mt-2">
                  <ul className="mt-2 space-y-1 text-sm">
                    {selectedOrder?.cart_items?.map((item: any, index: any) => (
                      <li key={index} className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <MenuIcon name={item.veg_nonveg?.toLowerCase() === "veg" ? "veg" : "nonVeg"} />
                          <span>{item.food_item_name || item?.varient_name} x {item.quantity}</span>
                        </span>
                        <span>₹{item.food_item_price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <hr />

              <div>
                <strong>Payment Breakdown</strong>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <p>Subtotal: ₹{selectedOrder?.item_sub_total_amount}</p>
                  <p>After Discount: ₹{selectedOrder?.after_discount_sub_amt}</p>
                  <p>Packing Fee: ₹{selectedOrder?.packing_fee}</p>
                  <p>Delivery Fee: ₹{selectedOrder?.delivery_fee?.toFixed(2)}</p>
                  <p>Tax (GST {selectedOrder?.gst_percentage}%): ₹{selectedOrder?.tax_amount}</p>
                  <p>Coupon Discount: ₹{selectedOrder?.coupon_amount}</p>
                  <p className="col-span-2 font-bold text-base text-green-700">Total: ₹{selectedOrder?.total_amount}</p>
                </div>
              </div>

              <hr />

              <div>
                <strong>Status Timings</strong>
                <ul className="text-xs mt-1 space-y-1">
                  {Object.entries(selectedOrder?.status_timing || {}).map(([status, time], idx) => {
                    if (!time || typeof time !== 'string') return null;

                    return (
                      <li key={idx}>
                        <strong>{status.replace(/_/g, " ")}:</strong> {new Date(time).toLocaleString()}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

          ) : (
            <p className="text-sm text-gray-500">Click on an order to view its details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
