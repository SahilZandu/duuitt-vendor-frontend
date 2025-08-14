// import { useNavigate, useSearchParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Loader from "../../../../components/loader/Loader";
// import { useVendor } from "../../../../lib/Context/VendorContext";
// import Input from "../../../../components/Ui/Input";
// import Button from "../../../../components/Ui/Button";
// import MenuIcon from "../../../../lib/MenuIcon";
// import { toast } from "react-toastify";
// import axiosInstance from "../../../../api/apiInstance";
// interface BankDetail {
//   bank_name?: string;
//   account_number?: string;
//   ifsc_code?: string;
//   status?: string;
// }

// interface FssaiDetail {
//   fssai_number?: string;
//   expiry_date?: string;
// }

// interface GstDetail {
//   gstn_number?: string;
//   expiration_date?: string;
// }

// interface PanDetail {
//   pan_number?: string;
// }

// type KycFormData = BankDetail | FssaiDetail | GstDetail | PanDetail;

// const KycDetail = () => {
//   const [searchParams] = useSearchParams();
//   const type = searchParams.get("type");
//   const { vendor, fetchVendor } = useVendor();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState<KycFormData>({});

//   console.log("formData", formData);

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const fetchKycDocuments = async () => {
//     setLoading(true);
//     try {
//       await fetchVendor();
//     } catch (error) {
//       console.error("Error fetching vendor:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchKycDocuments();
//   }, []);

//   // choose vendor data
//   const documentData =
//     type === "bank"
//       ? vendor?.bank_detail
//       : type === "fssai"
//         ? vendor?.fssai_detail
//         : type === "gst"
//           ? vendor?.gstn_detail
//           : type === "pan"
//             ? vendor?.pan_detail
//             : null;

//   useEffect(() => {
//     if (documentData) {
//       setFormData(documentData);
//     }
//   }, [documentData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // messages based on type
//   const infoMessages = {
//     bank: "Please enter your bank details for verification. Ensure that the information provided is accurate and legible. This information is crucial for successful verification. Thank You!",
//     fssai: "Please Enter your FSSAI number.",
//     gst: "Make sure your GST number is correct for tax compliance.",
//     pan: "Ensure your PAN number is valid and matches your legal entity name."
//   };
//   const handleSubmit = async () => {
//     setIsSubmitting(true);

//     try {
//       let payload = {};

//       if (type === "bank") {
//         payload = {
//           restaurant_id: vendor?.restaurant?._id,
//           key: "bank_detail",
//           bank_detail: {
//             bank_name: formData?.bank_name,
//             account_number: formData?.account_number,
//             ifsc_code: formData?.ifsc_code,
//             status: formData?.status,
//           },
//         };
//       }
//       console.log("payload", payload);
//       const response = await axiosInstance("post",
//         "/vendor/update-kyc-detail",
//         payload
//       );
//       console.log("response", response);

//       // if (response?.data?.statusCode === 400) {
//       //   toast.error(response?.data?.message);
//       // } else {
//       //   toast.success(`${type?.toUpperCase()} details updated successfully`);
//       //   navigate("/kyc-documents");
//       // }
//     } catch (err) {
//       console.error(`Error updating ${type} details`, err);
//       toast.error("Operation failed");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };


//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <div className="bg-white p-4">
//       <button
//         onClick={() => navigate("/kyc-documents")}
//         type="button"
//         className="cursor-pointer mb-2 inline-flex items-center text-base px-3 py-1 bg-gray-200 rounded-lg"
//       >
//         <span className="icon mr-2 text-lg">←</span>
//         Back
//       </button>

//       <h1 className="text-xl font-semibold mb-4">
//         {type?.toUpperCase()} Details
//       </h1>

//       {/* Info box */}
//       {type && (
//         <div className="flex items-center border border-red-500 bg-red-50 p-3 rounded-md mb-4">
//           <MenuIcon name="bulb" className="text-yellow-500 text-xl mr-3" />
//           <p className="text-sm text-red-700">{infoMessages[type]}</p>
//         </div>
//       )}

//       {documentData ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* BANK */}
//           {type === "bank" && (
//             <>
//               <Input
//                 type="text"
//                 name="bank_name"
//                 label="Bank Name"
//                 value={formData.bank_name || ""}
//                 onChange={handleChange}
//                 placeholder="Enter bank name"
//                 required
//               />
//               <Input
//                 type="text"
//                 name="account_number"
//                 label="Account Number"
//                 value={formData.account_number || ""}
//                 onChange={handleChange}
//                 placeholder="Enter account number"
//                 required
//               />
//               <Input
//                 type="text"
//                 name="ifsc_code"
//                 label="IFSC Code"
//                 value={formData?.ifsc_code || ""}
//                 onChange={handleChange}
//                 placeholder="Enter IFSC code"
//                 required
//               />
//             </>
//           )}

//           {/* FSSAI */}
//           {type === "fssai" && (
//             <>
//               <Input
//                 type="text"
//                 // name="fssai_number"
//                 label="FSSAI Number"
//       value={(formData as FssaiDetail).fssai_number || ""}
//                 onChange={handleChange}
//                 placeholder="Enter FSSAI number"
//               />
//               <Input
//                 type="date"
//                 name="expiry_date"
//                 // label="Expiry Date"
//                 value={formData.expiry_date || ""}
//                 onChange={handleChange}
//               />
//             </>
//           )}

//           {/* GST */}
//           {type === "gst" && (
//             <>
//               <Input
//                 type="text"
//                 name="gstn_number"
//                 label="GST Number"
//                 value={formData.gstn_number || ""}
//                 onChange={handleChange}
//                 placeholder="Enter GST number"
//               />
//               <Input
//                 type="date"
//                 name="expiration_date"
//                 label="Expiration Date"
//                 value={formData.expiration_date || ""}
//                 onChange={handleChange}
//               />
//             </>
//           )}

//           {/* PAN */}
//           {type === "pan" && (
//             <>
//               <Input
//                 type="text"
//                 name="pan_number"
//                 label="PAN Number"
//                 value={formData.pan_number || ""}
//                 onChange={handleChange}
//                 placeholder="Enter PAN number"
//               />
//             </>
//           )}
//         </div>
//       ) : (
//         <p>No details found for this type.</p>
//       )}

//       <Button label="Submit" variant="primary" className="mt-4" type="submit" onClick={handleSubmit} loading={isSubmitting} />
//     </div>
//   );
// };

// export default KycDetail;

const KycDetail = () => {
  return(
    <h1>Coming Soon</h1>
  )
}
export default KycDetail;