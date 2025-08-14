import { useEffect, useState } from "react";
import PageTitle from "../../../components/Ui/PageTitle";
import MenuIcon from "../../../lib/MenuIcon";
import { useVendor } from "../../../lib/Context/VendorContext";
import Loader from "../../../components/loader/Loader";
import { useNavigate } from "react-router-dom";

interface KycItem {
  label: string;
   status: string; 
  type: string;
}

const KycDocuments = () => {
  const [loading, setLoading] = useState(false);
  const { vendor, fetchVendor } = useVendor();
  const navigate = useNavigate();

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
    fetchKycDocuments();
  }, []);

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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white p-4">
      <PageTitle title="KYC Documents" />
      <div className="mt-4">
        {kycItems.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-3 border-b last:border-b-0 cursor-pointer"
            onClick={() => navigate(`/kyc-detail?type=${item.type}`)}
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

export default KycDocuments;
