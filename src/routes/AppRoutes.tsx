import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

import Login from "../pages/Login";
import Register from "../pages/Register";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/authenticatedPages/Dashboard";
import MainLayout from "../components/layout/MainLayout";

// Public route wrapper – blocks access for authenticated users
const PublicRoute = ({ children }: { children: React.ReactElement }) => {
  const authToken = Cookies.get("authToken");
  return authToken ? <Navigate to="/dashboard" replace /> : children;
};

// Private route wrapper – blocks access for unauthenticated users
const PrivateRoute = () => {
  const authToken = Cookies.get("authToken");
  return authToken ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes – only accessible if not logged in */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        }
      />

      {/* Protected routes – only accessible if logged in */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more authenticated routes here */}
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
