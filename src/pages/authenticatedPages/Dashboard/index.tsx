import React, { useEffect, useState } from "react";
import { fetchAllData } from "../../../api/HomeApi";
import MenuIcon from "../../../lib/MenuIcon";
import Loader from "../../../components/loader/Loader";
import OrderCard from "../../../components/Ui/OrderCard";
import type { OrderStatus } from "../../../types/types";
import NoDataFound from "../../../components/Ui/NoDataFound";
import { useVendor } from "../../../lib/Context/VendorContext";
import PageTitle from "../../../components/Ui/PageTitle";
import { useOrderNotification } from "../../../lib/Context/OrderNotificationContext";
import { useNavigate } from "react-router-dom";
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
 const { vendor } = useVendor();
 const { hasNewCompletedOrders, completedOrdersCount, markCompletedOrdersAsViewed } = useOrderNotification();
 const navigate = useNavigate();
 console.log("vendor", vendor);

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
        return "bg-green-500";
      case "ready_to_pickup":
      case "packing_processing": case "completed":
        return "bg-orange-500";
      case "waiting_for_confirmation":
        return "bg-blue-500";
      case "declined":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };
  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
        case "cooking":
            return "Preparing";
        case "ready_to_pickup":
            return "Ready to Pickup";
        case "waiting_for_confirmation":
            return "New";
        case "packing_processing":
            return "Packing";
        case "completed":
            return "Completed";
        case "declined":
            return "Declined";
        default:
            return "Unknown";
    }
};
  // Count new orders
  const newOrdersCount = data?.orderDetails?.filter(
    (order: any) => order.status === "waiting_for_confirmation"
  ).length || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* New Order Alert Banner */}
      {newOrdersCount > 0 && (
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-3 px-4 sticky top-0 z-20 shadow-lg animate-glow">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg className="w-6 h-6 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
              </div>
              <div>
                <p className="font-bold text-sm sm:text-base">
                  {newOrdersCount} New Order{newOrdersCount > 1 ? 's' : ''} Waiting for Confirmation!
                </p>
                <p className="text-xs opacity-90">Please review and accept the order{newOrdersCount > 1 ? 's' : ''} immediately</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completed Order Alert Banner */}
      {hasNewCompletedOrders && (
        <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-3 px-4 sticky top-0 z-20 shadow-lg animate-glow-green">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
              </div>
              <div>
                <p className="font-bold text-sm sm:text-base">
                  New Completed Order{completedOrdersCount > 1 ? 's' : ''}!
                </p>
                <p className="text-xs opacity-90">You have new completed orders. Great work!</p>
              </div>
            </div>
            <button
              onClick={() => {
                markCompletedOrdersAsViewed();
                navigate('/orders');
              }}
              className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-all duration-200 shadow-md"
            >
              View Orders
            </button>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Top Stats */}
        <PageTitle title={vendor?.restaurant?.name || ""}/>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
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
        ].map((card, index) => {
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600 border-blue-200',
            green: 'bg-green-100 text-green-600 border-green-200',
            red: 'bg-red-100 text-red-600 border-red-200',
            amber: 'bg-amber-100 text-amber-600 border-amber-200',
            fuchsia: 'bg-fuchsia-100 text-fuchsia-600 border-fuchsia-200',
          }[card.color] || 'bg-gray-100 text-gray-600 border-gray-200';

          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                {/* Icon Circle */}
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-xl ${colorClasses} border-2`}
                >
                  <MenuIcon name={card.icon || "info"} className="w-7 h-7" />
                </div>
              </div>

              {/* Text (value + label) */}
              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">
                  {card.value}
                </p>
                <p className="text-sm text-gray-600 mt-1 font-medium">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Orders Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Recent Orders
            </h2>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
              {data?.orderDetails?.length || 0} Orders
            </span>
          </div>
          <div className="space-y-4 max-h-[600px] overflow-auto pr-2">
            {data?.orderDetails && data.orderDetails.length > 0 ? (
              data.orderDetails.map((order: any) => (
                <div
                  key={order?._id}
                  onClick={() => setSelectedOrder(order)}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedOrder?._id === order?._id ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <OrderCard order={order}
                    onStatusChange={() => { }}
                    onReject={async (orderId: string) => {
                      console.log("Rejected order:", orderId);
                    }}
                    activeTab={"cooking"} />
                </div>
              ))
            ) : (
              <NoDataFound message="No recent orders found" />
            )}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 min-h-[600px]">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Order Details
          </h2>
          {selectedOrder ? (
            <div className="space-y-5 max-h-[520px] overflow-auto pr-2">
              {/* Order Info Section */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  Order Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white p-2 rounded-lg">
                    <p className="text-gray-500 text-xs">Invoice No</p>
                    <p className="font-semibold text-gray-900">{selectedOrder?.invoice_no}</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg">
                    <p className="text-gray-500 text-xs">Order ID</p>
                    <p className="font-semibold text-gray-900">{selectedOrder?.order_id}</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg">
                    <p className="text-gray-500 text-xs">Transaction ID</p>
                    <p className="font-semibold text-gray-900 text-xs truncate">{selectedOrder?.transaction_id}</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg">
                    <p className="text-gray-500 text-xs">Status</p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-white text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder?.status)}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg">
                    <p className="text-gray-500 text-xs">Verification Code</p>
                    <p className="font-bold text-purple-600 text-lg">{selectedOrder?.verification_code}</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg">
                    <p className="text-gray-500 text-xs">Cooking Time</p>
                    <p className="font-semibold text-gray-900">{selectedOrder?.cooking_time}</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg">
                    <p className="text-gray-500 text-xs">Distance</p>
                    <p className="font-semibold text-gray-900">{selectedOrder?.distance_from_customer} km</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg">
                    <p className="text-gray-500 text-xs">Delivery Time</p>
                    <p className="font-semibold text-gray-900 text-xs">{new Date(selectedOrder?.delivery_time).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Customer Info Section */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4 border border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Customer Information
                </h3>
                <div className="bg-white rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-gray-500 text-xs">Name</p>
                      <p className="font-semibold text-gray-900">{selectedOrder?.delivery_address?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <div>
                      <p className="text-gray-500 text-xs">Phone</p>
                      <p className="font-semibold text-gray-900">{selectedOrder?.delivery_address?.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-gray-500 text-xs">Address</p>
                      <p className="font-semibold text-gray-900">{selectedOrder?.delivery_address?.title}</p>
                      <p className="text-gray-600 text-xs mt-1">{selectedOrder?.delivery_address?.address}, {selectedOrder?.delivery_address?.landmark}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Ordered Section */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  Items Ordered
                </h3>
                <div className="bg-white rounded-lg p-3">
                  <ul className="space-y-2 text-sm">
                    {selectedOrder?.cart_items?.map((item: any, index: number) => (
                      <li key={index} className="flex justify-between items-center py-2 border-b last:border-b-0 border-gray-100">
                        <span className="flex items-center gap-2">
                          <MenuIcon name={item.veg_nonveg?.toLowerCase() === "veg" ? "veg" : "nonVeg"} />
                          <div>
                            <p className="font-medium text-gray-900">{item.food_item_name || item?.varient_name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </span>
                        <span className="font-bold text-gray-900">₹{item.food_item_price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Payment Breakdown Section */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  Payment Breakdown
                </h3>
                <div className="bg-white rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">₹{selectedOrder?.item_sub_total_amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">After Discount</span>
                    <span className="font-semibold text-gray-900">₹{selectedOrder?.after_discount_sub_amt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Packing Fee</span>
                    <span className="font-semibold text-gray-900">₹{selectedOrder?.packing_fee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold text-gray-900">₹{selectedOrder?.delivery_fee?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (GST {selectedOrder?.gst_percentage}%)</span>
                    <span className="font-semibold text-gray-900">₹{selectedOrder?.tax_amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coupon Discount</span>
                    <span className="font-semibold text-red-600">-₹{selectedOrder?.coupon_amount}</span>
                  </div>
                  <div className="border-t-2 border-dashed border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-bold text-base">Total Amount</span>
                      <span className="font-bold text-xl text-green-700">₹{selectedOrder?.total_amount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Timings Section */}
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Status Timings
                </h3>
                <div className="bg-white rounded-lg p-3">
                  <ul className="text-xs space-y-2">
                    {Object.entries(selectedOrder?.status_timing || {}).map(([status, time], idx) => {
                      if (!time || typeof time !== 'string') return null;

                      return (
                        <li key={idx} className="flex items-start gap-2 py-1">
                          <svg className="w-3 h-3 text-purple-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 capitalize">{status.replace(/_/g, " ")}</p>
                            <p className="text-gray-500">{new Date(time).toLocaleString()}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

          ) : (
            <NoDataFound message="Click on an order to view its details."/>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
