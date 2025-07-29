import { useEffect, useState, type JSX } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axiosInstance from "../api/apiInstance";

const ProtectedRoute = () => {
  const token = localStorage.getItem("accessToken");
  const vendor_id = localStorage.getItem("vendor_id");
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token || !vendor_id) {
        setLoading(false);
        return;
      }

      try {
        const formData = new FormData();
        formData.append("vendor_id", vendor_id);

        const response = await axiosInstance("post", "/vendor/get", {
          vendor_id: vendor_id,
        });
        setVendor(response?.data?.data);
      } catch (err) {
        console.error("Failed to fetch vendor profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, vendor_id]);

  if (!token) return <Navigate to="/login" replace />;
  if (loading) return <div>Loading...</div>;

  const isKycCompleted = vendor?.is_kyc_completed;

  // Prevent access to all protected routes except /vendor-kyc if KYC incomplete
  if (!isKycCompleted && location.pathname !== "/vendor-kyc") {
    return <Navigate to="/vendor-kyc" replace />;
  }

  // ✅ Only Outlet is needed here
  return <Outlet context={{ vendor }} />;
};

export default ProtectedRoute;
