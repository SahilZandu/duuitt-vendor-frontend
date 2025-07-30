import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axiosInstance from "../api/apiInstance";
import Loader from "../components/loader/Loader";

const ProtectedRoute = () => {
  const token = localStorage.getItem("accessToken");
  const vendor_id = localStorage.getItem("vendor_id");
  const is_kyc_completed = localStorage.getItem("is_kyc_completed");
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [shouldRedirectToKyc, setShouldRedirectToKyc] = useState(false);
  const [vendor, setVendor] = useState<any>(null);

  // ✅ Immediate redirect if token is missing
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchVendor = async () => {
      if (!token || !vendor_id) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance("post", "/vendor/get", { vendor_id });
        const fetchedVendor = response?.data?.data?.[0] || null;

        if (!fetchedVendor) {
          setShouldRedirectToKyc(true);
        } else {
          setVendor(fetchedVendor);

          // Save updated KYC status
          localStorage.setItem("is_kyc_completed", String(fetchedVendor.is_kyc_completed));

          if (!fetchedVendor.is_kyc_completed && location.pathname !== "/vendor-kyc") {
            setShouldRedirectToKyc(true);
          }
        }
      } catch (err) {
        console.error("Fetch vendor failed", err);
        setShouldRedirectToKyc(true);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [token, vendor_id, location.pathname]);

  if (loading) return <div>Loading...</div>;

  // ✅ If already KYC done, don't allow access to /vendor-kyc again
  if (token && is_kyc_completed === "true" && location.pathname === "/vendor-kyc") {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ If vendor not fetched or needs KYC
  if (shouldRedirectToKyc) {
    return <Navigate to="/vendor-kyc" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
