import { useEffect, useRef, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import PageTitle from "./PageTitle";
import Loader from "../loader/Loader";
import MenuIcon from "../../lib/MenuIcon";
import { useVendor } from "../../lib/Context/VendorContext";

interface KycItem {
  label: string;
  status: string;
  type: string;
}

const KycPage = () => {
  const [loading, setLoading] = useState(false);
  const { vendor, fetchVendor } = useVendor();
  console.log("vendor------", vendor);
  
  const navigate = useNavigate();
  const previousVendor = useRef<typeof vendor | null>(null);
  const notifyChange = (label: string, oldStatus: string, newStatus: string) => {
    console.log(`KYC status changed for ${label}: ${oldStatus} -> ${newStatus}`);
  };
  
  useEffect(() => {
    if (vendor && previousVendor.current) {
      const old = previousVendor.current;
      const newv = vendor;

      const compareAndNotify = (
        label: string,
        oldStatus?: string,
        newStatus?: string
      ) => {
        if (oldStatus && newStatus && oldStatus !== newStatus) {
          notifyChange(label, oldStatus, newStatus);
        }
      };

      compareAndNotify(
        "Bank Details",
        old.bank_detail?.status,
        newv.bank_detail?.status
      );
      compareAndNotify(
        "FSSAI Details",
        old.fssai_detail?.status,
        newv.fssai_detail?.status
      );
      compareAndNotify(
        "GST Details",
        old.gstn_detail?.status,
        newv.gstn_detail?.status
      );
      compareAndNotify(
        "PAN Card Details",
        old.pan_detail?.status,
        newv.pan_detail?.status
      );
    }

    // Update stored vendor for next comparison
    previousVendor.current = vendor;
  }, [vendor]);
  
  const getStatusStyle = (status: KycItem["status"]) => {
    switch (status) {
      case "approved":
        return "text-green-600 border border-green-600";
      case "pending":
        return "text-yellow-600 border border-yellow-600";
      case "declined":
        return "text-red-600 border border-red-600";
      default:
        return "";
    }
  };

  const getTickBg = (status: KycItem["status"]) => {
    switch (status) {
      case "approved":
        return "bg-green-600";
      case "pending":
        return "bg-yellow-500";
      case "declined":
        return "bg-red-600";
      default:
        return "";
    }
  };

  const fetchKycDocuments = async () => {
    setLoading(true);
    try {
      await fetchVendor();
    } catch (error) {
      console.error("Error fetching vendor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!vendor) {
      fetchKycDocuments();
    }
  }, [vendor]);

  const kycItems: KycItem[] = [
    {
      label: "Bank Details",
      status: vendor?.bank_detail?.status || "pending",
      type: "bank",
    },
    {
      label: "FSSAI Details",
      status: vendor?.fssai_detail?.status || "pending",
      type: "fssai",
    },
    {
      label: "GST Details",
      status: vendor?.gstn_detail?.status || "pending",
      type: "gst",
    },
    {
      label: "PAN Card Details",
      status: vendor?.pan_detail?.status || "pending",
      type: "pan",
    },
  ];
  const location = useLocation();
  const handleNavigate = (type: string) => {
    if (location.pathname.startsWith("/vendor-kyc")) {
      navigate(`/vendor-kyc/kyc-detail?type=${type}`);
    } else {
      navigate(`/kyc-documents/kyc-detail?type=${type}`);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white p-4">
      <PageTitle title="KYC Documents" />
      <div className="mt-4">
        {kycItems?.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-3 border-b last:border-b-0 cursor-pointer"
            onClick={() => handleNavigate(item.type)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full ${getTickBg(
                  item.status
                )} text-white text-sm`}
              >
                <MenuIcon name="tick" />
              </div>
              <span className="text-gray-800">{item.label}</span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                  item.status
                )}`}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
              <button>
                <MenuIcon name="sideArrow" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KycPage;
