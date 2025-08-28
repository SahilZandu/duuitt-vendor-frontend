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
interface OrderCounts {
  all: number;
  new: number;
  cooking: number;
  packing: number;
  ready: number;
}

const Orders = () => {
  const restaurantId = localStorage.getItem("restaurant_id") || "";

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
    <div className="p-6 bg-gray-100 min-h-screen">
      <Tabs
        tabs={tabOptions}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {loading ? (
        <Loader />
      ) : orders && orders?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders &&
            orders?.map((order) => (
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
        <div className="text-center py-10 text-gray-400">
          <NoDataFound message="No Orders found" />
        </div>
      )}
    </div>
  );
};

export default Orders;
