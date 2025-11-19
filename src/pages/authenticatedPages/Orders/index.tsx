import { useEffect, useState } from "react";
import {
  fetchWaitingOrders,
  getOrderStatus,
  updateOrderStatus,
  type Order,
} from "../../../api/OrderApi";
import OrderCard from "../../../components/Ui/OrderCard";
import Tabs from "../../../components/Ui/Tabs";
import NoDataFound from "../../../components/Ui/NoDataFound";
import Loader from "../../../components/loader/Loader";
import { toast } from "react-toastify";
import { useOrderNotification } from "../../../lib/Context/OrderNotificationContext";
interface OrderCounts {
  all: number;
  new: number;
  cooking: number;
  packing: number;
  ready: number;
}

const Orders = () => {
  const restaurantId = localStorage.getItem("restaurant_id") || "";
  const { hasNewCompletedOrders, completedOrdersCount, markCompletedOrdersAsViewed } = useOrderNotification();

  const [orders, setOrders] = useState<Order[]>([]);
  console.log({ orders });
  const [orderCounts, setOrderCounts] = useState<OrderCounts>({
    all: 0,
    new: 0,
    cooking: 0,
    packing: 0,
    ready: 0,
  });

  const [activeTab, setActiveTab] = useState<string>("all");
  console.log({ activeTab });

  const [loading, setLoading] = useState<boolean>(false);

  // Load all orders based on tab
  const loadOrders = async (tab: string) => {
    setLoading(true);
    try {
      let data: Order[] = [];
      if (tab === "new") {
        data = await fetchWaitingOrders(restaurantId);
        console.log({ data });
      } else if (tab === "cooking") {
        data = await getOrderStatus({
          restaurant_id: restaurantId,
          status: "cooking",
        });
      } else if (tab === "packing") {
        data = await getOrderStatus({
          restaurant_id: restaurantId,
          status: "packing_processing",
        });
      } else if (tab === "ready") {
        data = await getOrderStatus({
          restaurant_id: restaurantId,
          status: "ready_to_pickup",
        });
      } else if (tab === "all") {
        data = await getOrderStatus({
          restaurant_id: restaurantId,
          status: "all",
        });
      }

      setOrders(data);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };
  const loadOrderCounts = async () => {
    try {
      const all = await getOrderStatus({
        restaurant_id: restaurantId,
        status: "all",
      });
      const newOrders = await fetchWaitingOrders(restaurantId);
      const cooking = await getOrderStatus({
        restaurant_id: restaurantId,
        status: "cooking",
      });
      const packing = await getOrderStatus({
        restaurant_id: restaurantId,
        status: "packing_processing",
      });
      const ready = await getOrderStatus({
        restaurant_id: restaurantId,
        status: "ready_to_pickup",
      });

      setOrderCounts({
        all: all.length,
        new: newOrders.length,
        cooking: cooking.length,
        packing: packing.length,
        ready: ready.length,
      });
    } catch (error) {
      console.error("Error loading order counts:", error);
    }
  };

  const handleStatusChange = async (
    orderId: string,
    status: string,
    time?: number
  ) => {
    const payload: any = {
      food_order_id: orderId,
      status,
    };

    if (status === "cooking" && time) {
      payload.cooking_time = `${time} minutes`;
    }

    const success = await updateOrderStatus(payload);
    console.log({ success });
    if (success?.statusCode === 404) {
      toast.error(
        success.message ||
          "This order cannot proceed because no rider is assigned."
      );
    } else {
      toast.success("Order Updated!");
      loadOrders(activeTab);
    }
  };
  useEffect(() => {
    loadOrders(activeTab);
    loadOrderCounts();
  }, [activeTab]);

  const handleRejectOrder = async (orderId: string) => {
    const success = await updateOrderStatus({
      food_order_id: orderId,
      status: "declined",
    });
    console.log({ success });
    toast.success("Order rejected.");
    loadOrders(activeTab);
  };

  // Tab options based on new order condition
  const tabOptions = [
    { label: `All Orders (${orderCounts?.all})`, value: "all", icon: "all" },
    { label: `New Orders (${orderCounts?.new})`, value: "new", icon: "new" },
    {
      label: `Preparing (${orderCounts.cooking})`,
      value: "cooking",
      icon: "cooking",
    },
    {
      label: `Packed (${orderCounts.packing})`,
      value: "packing",
      icon: "packing",
    },
    { label: `Ready (${orderCounts.ready})`, value: "ready", icon: "ready" },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    loadOrders(tab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* New Order Alert Banner */}
      {orderCounts.new > 0 && (
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
                  {orderCounts.new} New Order{orderCounts.new > 1 ? 's' : ''} Waiting for Confirmation!
                </p>
                <p className="text-xs opacity-90">Please review and accept the order{orderCounts.new > 1 ? 's' : ''} immediately</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("new")}
              className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-all duration-200 shadow-md"
            >
              View Now
            </button>
          </div>
        </div>
      )}

      {/* Completed Order Alert Banner */}
      {hasNewCompletedOrders && (
        <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-3 px-4 sticky z-20 shadow-lg animate-glow-green" style={{ top: orderCounts.new > 0 ? '52px' : '0' }}>
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
              onClick={() => markCompletedOrdersAsViewed()}
              className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-all duration-200 shadow-md"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm" style={{ top: orderCounts.new > 0 ? '52px' : '0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Orders Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Track and manage all your restaurant orders in real-time
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-2">
                <p className="text-xs text-purple-600 font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-purple-700">{orderCounts.all}</p>
              </div>
              <div className={`border rounded-lg px-4 py-2 transition-all duration-300 ${
                orderCounts.new > 0
                  ? "bg-gradient-to-br from-red-50 to-orange-50 border-red-300 animate-pulse"
                  : "bg-blue-50 border-blue-200"
              }`}>
                <p className={`text-xs font-medium ${orderCounts.new > 0 ? "text-red-600" : "text-blue-600"}`}>
                  New Orders
                </p>
                <p className={`text-2xl font-bold ${orderCounts.new > 0 ? "text-red-700" : "text-blue-700"}`}>
                  {orderCounts.new}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs Section */}
        <Tabs
          tabs={tabOptions}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Orders Grid */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader />
          </div>
        ) : orders && orders?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {orders?.map((order) => (
              <OrderCard
                key={order?._id}
                order={order}
                onStatusChange={handleStatusChange}
                onReject={handleRejectOrder}
                activeTab={activeTab}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 py-16">
            <NoDataFound message="No Orders found" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
