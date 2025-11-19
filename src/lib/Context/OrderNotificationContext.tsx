import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getOrderStatus, fetchWaitingOrders } from "../../api/OrderApi";

interface OrderNotificationContextType {
  completedOrdersCount: number;
  hasNewCompletedOrders: boolean;
  newOrdersCount: number;
  hasNewOrders: boolean;
  lastCheckedTime: Date;
  refreshOrders: () => Promise<void>;
  markCompletedOrdersAsViewed: () => void;
  markNewOrdersAsViewed: () => void;
}

const OrderNotificationContext = createContext<OrderNotificationContextType | undefined>(undefined);

export const OrderNotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const [hasNewCompletedOrders, setHasNewCompletedOrders] = useState(false);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [hasNewOrders, setHasNewOrders] = useState(false);
  const [lastCheckedTime, setLastCheckedTime] = useState(new Date());
  const [previousCompletedCount, setPreviousCompletedCount] = useState(0);
  const [previousNewOrdersCount, setPreviousNewOrdersCount] = useState(0);

  const restaurantId = localStorage.getItem("restaurant_id") || "";

  const refreshOrders = async () => {
    if (!restaurantId) return;

    try {
      // Fetch all orders to check for completed ones
      const allOrders = await getOrderStatus({
        restaurant_id: restaurantId,
        status: "all",
      });

      // Fetch waiting orders (new orders)
      const waitingOrders = await fetchWaitingOrders(restaurantId);

      // Filter for completed orders
      const completedOrders = allOrders.filter(order => order.status === "completed");
      const currentCompletedCount = completedOrders.length;
      const currentNewOrdersCount = waitingOrders.length;

      setCompletedOrdersCount(currentCompletedCount);
      setNewOrdersCount(currentNewOrdersCount);

      // Check if there are new completed orders since last check
      if (currentCompletedCount > previousCompletedCount && previousCompletedCount > 0) {
        setHasNewCompletedOrders(true);
      }

      // Check if there are new orders since last check
      if (currentNewOrdersCount > previousNewOrdersCount && previousNewOrdersCount >= 0) {
        setHasNewOrders(true);
      }

      setPreviousCompletedCount(currentCompletedCount);
      setPreviousNewOrdersCount(currentNewOrdersCount);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const markCompletedOrdersAsViewed = () => {
    setHasNewCompletedOrders(false);
    setLastCheckedTime(new Date());
  };

  const markNewOrdersAsViewed = () => {
    setHasNewOrders(false);
    setLastCheckedTime(new Date());
  };

  // Poll for new orders every 15 seconds
  useEffect(() => {
    if (!restaurantId) return;

    // Initial fetch
    refreshOrders();

    // Set up polling interval
    const interval = setInterval(() => {
      refreshOrders();
    }, 15000); // 15 seconds for more responsive notifications

    return () => clearInterval(interval);
  }, [restaurantId]);

  return (
    <OrderNotificationContext.Provider
      value={{
        completedOrdersCount,
        hasNewCompletedOrders,
        newOrdersCount,
        hasNewOrders,
        lastCheckedTime,
        refreshOrders,
        markCompletedOrdersAsViewed,
        markNewOrdersAsViewed,
      }}
    >
      {children}
    </OrderNotificationContext.Provider>
  );
};

export const useOrderNotification = () => {
  const context = useContext(OrderNotificationContext);
  if (!context) {
    throw new Error("useOrderNotification must be used within OrderNotificationProvider");
  }
  return context;
};
