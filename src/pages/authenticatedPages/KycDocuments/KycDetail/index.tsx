import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../../../../components/loader/Loader";
import { useVendor } from "../../../../lib/Context/VendorContext";
import Input from "../../../../components/Ui/Input";
import Button from "../../../../components/Ui/Button";
import MenuIcon from "../../../../lib/MenuIcon";
import { toast } from "react-toastify";
import axiosInstance from "../../../../api/apiInstance";
import FileUpload from "../../../../components/Ui/FileUpload";
import { bankSchema, fssaiSchema, gstSchema, panSchema } from "../../../../validations/kycSchema";
import { validateFormData } from "../../../../utils/validateForm";
interface BankDetail {
  bank_name?: string;
  account_number?: string;
  ifsc_code?: string;
  status?: string;
  reason?: string;
  image?: File;
}

interface FssaiDetail {
  account_number?: string;
  expiration_date?: string;
  reason?: string;
  status?: string;
  image?: File;
}

interface GstDetail {
  gstn_number?: string;
  expiration_date?: string;
  reason?: string;
  status?: string;
  image?: File;
}

interface PanDetail {
  pan_number?: string;
  reason?: string;
  status?: string;
  image?: File;
}
type KycType = "bank" | "fssai" | "gst" | "pan";
type KycFormData = BankDetail | FssaiDetail | GstDetail | PanDetail;

const KycDetail = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") as KycType | null;
  const { vendor, fetchVendor } = useVendor();
  const navigate = useNavigate();
  const [isFieldEdited, setIsFieldEdited] = useState(false);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<KycFormData>({});
  const isDisabled = formData?.status === "pending";
  console.log("isDisabled", isDisabled);

  console.log("formData", formData);

  const [errors, setErrors] = useState({});
  console.log("errors-----------", errors);

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // choose vendor data
  const documentData =
    type === "bank"
      ? vendor?.bank_detail
      : type === "fssai"
        ? vendor?.fssai_detail
        : type === "gst"
          ? vendor?.gstn_detail
          : type === "pan"
            ? vendor?.pan_detail
            : null;

  useEffect(() => {
    if (documentData) {
      setFormData(documentData as KycFormData);
    }
  }, [documentData]);

  const getSchema = () => {
    switch (type) {
      case "bank": return bankSchema;
      case "fssai": return fssaiSchema;
      case "gst": return gstSchema;
      case "pan": return panSchema;
      default: return bankSchema;
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setIsFieldEdited(true);
  };
  const handleFileUpload = (file: File) => {
    setFormData((prev) => ({ ...prev, image: file }));
    setErrors((prev) => ({ ...prev, image: "" }));
    setIsFieldEdited(false); // user provided new doc
  };

  // messages based on type
  const infoMessages: Record<KycType, string> = {
    bank: "Please enter your bank details for verification. Ensure that the information provided is accurate and legible. This information is crucial for successful verification. Thank You!",
    fssai: "Please Enter your FSSAI number. We require a clear image of your FSSAI document for verification. Ensure that the uploaded file contains all relevant details. Thank you for your cooperation.",
    gst: "Please Enter your GST number. We require a clear image of your GST document for verification. Ensure that the uploaded file contains all relevant details. Thank you for your cooperation.",
    pan: "Please Enter your PAN card number. We require a clear image of your PAN card for verification. Ensure that the document is legible and include your photograph, name and PAN details. This information is crucial for accurate verification.Thank you."
  };
  const location = useLocation();
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { valid, errors } = await validateFormData(getSchema(), formData);
    if (!valid) {
      setErrors(errors);
      setIsSubmitting(false);
      return;
    }
    if ((type === "fssai" || type === "gst" || type === "pan") && isFieldEdited) {
      toast.error("Please upload the latest document since you changed details.");
      setErrors((prev) => ({ ...prev, image: "Latest document is required" }));
      setIsSubmitting(false);
      return;
    }
    try {
      let sendFormData = new FormData();

      if (type === "bank" && formData && "bank_name" in formData) {
        const bankData = formData as BankDetail;
        sendFormData.append("restaurant_id", localStorage.getItem("restaurant_id") || "");
        sendFormData.append("vendor_id", localStorage.getItem("vendor_id") || "");
        sendFormData.append("key", "bank_detail");
        sendFormData.append(
          "bank_detail",
          JSON.stringify({
            bank_name: bankData.bank_name,
            account_number: bankData.account_number,
            ifsc_code: bankData.ifsc_code,
            status: "pending",
          })
        );
      }

      if (type === "fssai" && formData && "account_number" in formData) {
        const fssaiData = formData as FssaiDetail;

        sendFormData.append("restaurant_id", localStorage.getItem("restaurant_id") || "");
        sendFormData.append("key", "fssai_detail");
        if (fssaiData.image) sendFormData.append("image", fssaiData.image);
        sendFormData.append(
          "fssai_detail",
          JSON.stringify({
            account_number: fssaiData.account_number,
            expiration_date: fssaiData.expiration_date,
            status: "pending",
          })
        );
      }

      if (type === "gst" && formData && "gstn_number" in formData) {
        const gstData = formData as GstDetail;

        sendFormData.append("restaurant_id", localStorage.getItem("restaurant_id") || "");
        sendFormData.append("key", "gstn_detail");
        if (gstData.image) sendFormData.append("image", gstData.image);
        sendFormData.append(
          "gstn_detail",
          JSON.stringify({
            gstn_number: gstData?.gstn_number,
            expiration_date: gstData?.expiration_date,
            status: "pending",
          })
        );
      }

      if (type === "pan" && formData && "pan_number" in formData) {
        const panData = formData as PanDetail;

        sendFormData.append("restaurant_id", localStorage.getItem("restaurant_id") || "");
        sendFormData.append("key", "pan_detail");
        if (panData.image) sendFormData.append("image", panData.image);
        sendFormData.append(
          "pan_detail",
          JSON.stringify({
            pan_number: panData.pan_number,
            status: "pending",
          })
        );
      }


      const response = await axiosInstance("post", "/vendor/update-kyc-detail", sendFormData);
      console.log("response", response);
      if (response?.data?.statusCode === 200) {
        toast.success(`${type?.toUpperCase()} details updated successfully`);
        if (location.pathname.startsWith("/vendor-kyc")) {
          navigate(`/vendor-kyc`);
        } else {
          navigate(`/kyc-documents`);
        }
      }


    } catch (err) {
      console.error(`Error updating ${type} details`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-white p-4">
      <button
        onClick={() => navigate("/kyc-documents")}
        type="button"
        className="cursor-pointer mb-2 inline-flex items-center text-base px-3 py-1 bg-gray-200 rounded-lg"
      >
        <span className="icon mr-2 text-lg">←</span>
        Back
      </button>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">{type?.toUpperCase()} Details</h1>

        {formData?.reason && (
          <div className="flex items-start gap-2 border border-red-400 bg-red-50 p-3 rounded-md w-full sm:w-1/2">
            <MenuIcon name="tooltip" className="text-red-500 mt-0.5" />
            <div>
              <p className="font-medium text-red-700 text-sm">Reason for Rejection</p>
              <p className="text-xs text-red-600">{formData?.reason}</p>
            </div>
          </div>
        )}
      </div>
      {documentData ? (
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {/* BANK */}
          {type === "bank" && (
            <>
              <Input
                type="text"
                name="bank_name"
                label="Bank Name"
                value={(formData as BankDetail).bank_name || ""}
                onChange={handleChange}
                placeholder="Enter bank name"
                error={(errors as any)?.bank_name}
                required
                disabled={isDisabled}
              />
              <Input
                type="text"
                name="account_number"
                label="Account Number"
                value={(formData as BankDetail).account_number || ""}
                onChange={handleChange}
                error={(errors as any)?.account_number}
                placeholder="Enter account number"
                required
                disabled={isDisabled}
              />

              <Input
                type="text"
                name="ifsc_code"
                label="IFSC Code"
                value={(formData as BankDetail).ifsc_code || ""}
                onChange={handleChange}
                error={(errors as any)?.ifsc_code}
                placeholder="Enter IFSC code"
                required
                disabled={isDisabled}
              />
            </>
          )}

          {/* FSSAI */}
          {type === "fssai" && (
            <>
              <div className="col-span-2">
                <Input
                  type="text"
                  name="account_number"
                  label="FSSAI Number"
                  value={(formData as FssaiDetail).account_number || ""}
                  onChange={handleChange}
                  error={(errors as any)?.account_number}
                  placeholder="Enter FSSAI number"
                  required
                  disabled={isDisabled}
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="date"
                  name="expiration_date"
                  label="Expiry Date"
                  value={(formData as FssaiDetail)?.expiration_date || ""}
                  onChange={handleChange}
                  required
                  error={(errors as any)?.expiration_date}
                  disabled={isDisabled}
                />
              </div>
              <FileUpload
                name="fssai_file"
                label="Upload FSSAI Document"
                file={(formData as any).image}
                onChange={handleFileUpload}
                required
                disabled={isDisabled}
              />

            </>
          )}

          {/* GST */}
          {type === "gst" && (
            <>
              <Input
                type="text"
                name="gstn_number"
                label="GST Number"
                value={(formData as GstDetail).gstn_number || ""}
                onChange={handleChange}
                error={(errors as any)?.gstn_number}
                placeholder="Enter GST number"
              />
              <Input
                type="date"
                name="expiration_date"
                label="Expiration Date"
                value={(formData as GstDetail).expiration_date || ""}
                onChange={handleChange}
              />
              <div className="col-span-2">
                <FileUpload
                  name="fssai_file"
                  label="Upload GST Document"
                  file={(formData as any).image}
                  onChange={handleFileUpload}
                />
              </div>

            </>
          )}

          {/* PAN */}
          {type === "pan" && (
            <>
              <Input
                type="text"
                name="pan_number"
                label="PAN card number"
                value={(formData as PanDetail).pan_number || ""}
                onChange={handleChange}
                error={(errors as any)?.pan_number}
                placeholder="Enter PAN number"
              />
              <FileUpload
                name="fssai_file"
                label="Upload FSSAI Document"
                file={(formData as any).image}
                onChange={handleFileUpload}
              />
            </>
          )}

        </div>
      ) : (
        <p>No details found for this type.</p>
      )}
      {/* Info box */}
      {type && (
        <div className="flex items-center border border-red-500  p-3 rounded-md mt-4">
          <MenuIcon name="bulb" className="text-yellow-500 text-xl mr-3" />
          <p className="text-sm text-red-700">{infoMessages[type]}</p>
        </div>
      )}
      {!isDisabled && (
        <div className="flex justify-end">
          <Button label="Submit" variant="primary" className="mt-4" type="submit" onClick={handleSubmit} loading={isSubmitting} />
        </div>
      )}

    </div>
  );
};

export default KycDetail;

// const KycDetail = () => {
//   return(
//     <h1>Coming Soon</h1>
//   )
// }
// export default KycDetail;