import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSidebar } from "../../lib/Context/SidebarContext";
import { useOrderNotification } from "../../lib/Context/OrderNotificationContext";

const MainLayout: React.FC = () => {
  const { isCollapsed } = useSidebar();
  const {
    hasNewCompletedOrders,
    completedOrdersCount,
    hasNewOrders,
    newOrdersCount,
    markCompletedOrdersAsViewed,
    markNewOrdersAsViewed
  } = useOrderNotification();
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is currently on Dashboard or Orders pages
  const isOnDashboardOrOrders =
    location.pathname === "/" ||
    location.pathname === "/dashboard" ||
    location.pathname.startsWith("/orders");

  // Show alerts only when NOT on Dashboard/Orders pages
  const showNewOrderAlert = hasNewOrders && !isOnDashboardOrOrders;
  const showCompletedOrderAlert = hasNewCompletedOrders && !isOnDashboardOrOrders;

  const handleViewNewOrders = () => {
    markNewOrdersAsViewed();
    navigate("/orders");
  };

  const handleViewCompletedOrders = () => {
    markCompletedOrdersAsViewed();
    navigate("/orders");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Global Alert for New Orders - HIGH PRIORITY */}
      {showNewOrderAlert && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white rounded-2xl shadow-2xl p-5 max-w-md border-2 border-white animate-glow-red">
            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                  <svg className="w-7 h-7 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-400"></span>
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg flex items-center gap-2">
                  <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-yellow-400 text-red-900 text-xs font-black">
                    {newOrdersCount}
                  </span>
                  New Order{newOrdersCount > 1 ? 's' : ''}!
                </h4>
                <p className="text-sm opacity-95 mt-1.5 font-medium">
                  Waiting for your confirmation
                </p>
                <p className="text-xs opacity-75 mt-1">
                  Please review and accept immediately to start preparing
                </p>
              </div>
              <button
                onClick={() => markNewOrdersAsViewed()}
                className="flex-shrink-0 text-white hover:bg-white/20 rounded-full p-1.5 transition-colors"
                aria-label="Dismiss notification"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleViewNewOrders}
                className="flex-1 bg-white text-red-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-yellow-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                View Orders Now →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Alert for Completed Orders */}
      {showCompletedOrderAlert && !showNewOrderAlert && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-xl shadow-2xl p-4 max-w-md animate-glow-green">
            <div className="flex items-start gap-3">
              <div className="relative flex-shrink-0">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">Order Completed!</h4>
                <p className="text-xs opacity-90 mt-1">
                  {completedOrdersCount} order{completedOrdersCount > 1 ? 's' : ''} completed. Great work!
                </p>
              </div>
              <button
                onClick={() => markCompletedOrdersAsViewed()}
                className="flex-shrink-0 text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleViewCompletedOrders}
                className="flex-1 bg-white text-green-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-all duration-200 shadow-md"
              >
                View Orders
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
