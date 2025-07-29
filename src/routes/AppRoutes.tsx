import { Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/Register";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/authenticatedPages/Dashboard";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../api/ProtectedRoute";
import PublicRoute from "../api/PublicRoute";
import VendorKycPage from "../pages/kyc/VendorKycPage";
import OrderHistory from "../pages/authenticatedPages/Settings/OrderHistory/OrderHistory";
import ViewOrderDetails from "../pages/authenticatedPages/Settings/OrderHistory/ViewOrderDetails";
import RestaurantProfile from "../pages/authenticatedPages/Settings/RestaurantProfile";
import TeamManagement from "../pages/authenticatedPages/team/TeamManagement";
import VendorProfile from "../pages/authenticatedPages/Settings/VendorProfile";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* All protected routes use layout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vendor-kyc" element={<VendorKycPage />} />
          <Route path="/outlet/order-history" element={<OrderHistory />} />
          <Route path="/outlet/order-history/view/:id" element={<ViewOrderDetails />} />
          <Route path="/team" element={<TeamManagement />} />
          <Route path="/outlet/restaurant-profile" element={<RestaurantProfile />} />
          <Route path="/outlet/manage-profile" element={<VendorProfile />} />
        </Route>
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
