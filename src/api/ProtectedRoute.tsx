import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axiosInstance from "../api/apiInstance";
import Loader from "../components/loader/Loader";

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
        const response = await axiosInstance("post", "/vendor/get", {
          vendor_id: vendor_id,
        });
        setVendor(response?.data?.data[0]);
      } catch (err) {
        console.error("Failed to fetch vendor profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, vendor_id]);

  if (!token) return <Navigate to="/login" replace />;
  if (loading) return <div><Loader /> </div>;
  if (!vendor) return <Navigate to="/login" replace />;

  const isKycCompleted = vendor?.is_kyc_completed === true;


  if (!isKycCompleted && location.pathname !== "/vendor-kyc") {
    return <Navigate to="/vendor-kyc" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
