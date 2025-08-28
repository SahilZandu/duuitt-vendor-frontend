import { Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/Register";
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/authenticatedPages/Dashboard";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../api/ProtectedRoute";
import PublicRoute from "../api/PublicRoute";
import VendorKycPage from "../pages/kyc/VendorKycPage";
import OrderHistory from "../pages/authenticatedPages/Outlet/OrderHistory/OrderHistory";
import RestaurantProfile from "../pages/authenticatedPages/Outlet/RestaurantProfile";
import TeamManagement from "../pages/authenticatedPages/team/TeamManagement";
import VendorProfile from "../pages/authenticatedPages/Outlet/VendorProfile";
import Rating from "../pages/authenticatedPages/Outlet/Rating";
import PaymentLogs from "../pages/authenticatedPages/Outlet/PaymentLogs";
import KycSubmitted from "../components/kyc/KycSubmitted";
import OfferManagement from "../pages/authenticatedPages/offer/OfferManagement";
import Orders from "../pages/authenticatedPages/Orders";
import ViewOrder from "../pages/authenticatedPages/Orders/ViewOrder";
import Timings from "../pages/authenticatedPages/Timings";
import FoodItemDetail from "../pages/authenticatedPages/Food-Menu/FoodItemDetail";
import FoodItemEdit from "../pages/authenticatedPages/Food-Menu/FoodItemEdit";
import AddFoodItem from "../pages/authenticatedPages/Food-Menu/AddFoodItem";
import FoodMenu from "../pages/authenticatedPages/Food-Menu";
import AddTeamMember from "../pages/authenticatedPages/team/AddTeamMember";
import KycDocuments from "../pages/authenticatedPages/KycDocuments";
import KycDetail from "../pages/authenticatedPages/KycDocuments/KycDetail";
import PendingPayouts from "../pages/authenticatedPages/PendingPayouts";

import KycLayout from "../components/layout/KycLayout";
import TermsAndConditions from "../pages/TermsAndConditions";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import OpenSourceLibrary from "../pages/OpenSourceLibrary";
import SettledPaymentList from "../pages/SettledPayment/SettledPaymentList";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected routes */}
      <Route element={<KycLayout />}>
        <Route path="/kyc-submitted" element={<KycSubmitted />} />
        <Route path="/vendor-kyc" element={<VendorKycPage />} />
        <Route path="/vendor-kyc/kyc-detail" element={<KycDetail />} />
      </Route>

      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/open-source-library" element={<OpenSourceLibrary />} />

      <Route element={<ProtectedRoute />}>
        {/* All protected routes use layout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/outlet/order-history" element={<OrderHistory />} />
          <Route
            path="/outlet/order-history/view/:id"
            element={<ViewOrder />}
          />
          <Route path="/team" element={<TeamManagement />} />
          <Route path="/team/add-team-member" element={<AddTeamMember />} />

          <Route
            path="/outlet/restaurant-profile"
            element={<RestaurantProfile />}
          />
          <Route path="/outlet/rating" element={<Rating />} />
          <Route path="/outlet/payment-logs" element={<PaymentLogs />} />
          <Route path="/offers" element={<OfferManagement />} />
          {/* Orders...... */}
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/view-order/:id" element={<ViewOrder />} />
          {/* Timings */}
          <Route path="/timings" element={<Timings />} />
          <Route path="/food-menu" element={<FoodMenu />} />
          <Route path="/food-menu/add-product" element={<AddFoodItem />} />

          <Route path="/food-item/:id" element={<FoodItemDetail />} />
          {/* ....Setting.... */}
          <Route path="/setting/manage-profile" element={<VendorProfile />} />

          <Route path="/food-item/edit" element={<FoodItemEdit />} />

          <Route path="/kyc-documents" element={<KycDocuments />} />
          <Route path="/kyc-documents/kyc-detail" element={<KycDetail />} />

          <Route path="/pending-payouts" element={<PendingPayouts />} />
          <Route
            path="/settled-payment-list"
            element={<SettledPaymentList />}
          />
        </Route>
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
