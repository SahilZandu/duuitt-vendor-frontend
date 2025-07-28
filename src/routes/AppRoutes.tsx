import { Routes, Route, Navigate } from "react-router-dom";
// import Login from "../pages/Login";
import Register from "../pages/Register";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/authenticatedPages/Dashboard";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../api/ProtectedRoute";
import PublicRoute from "../api/PublicRoute";
import OrderHistory from "../pages/authenticatedPages/Settings/OrderHistory/OrderHistory";
import ViewOrderDetails from "../pages/authenticatedPages/Settings/OrderHistory/ViewOrderDetails";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        {/* You can add /login here too if needed */}
      </Route>

      {/* Protected Routes with layout */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/outlet/order-history" element={<OrderHistory />} />
        <Route path="/outlet/order-history/view/:id" element={<ViewOrderDetails />} />


      </Route>

      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
