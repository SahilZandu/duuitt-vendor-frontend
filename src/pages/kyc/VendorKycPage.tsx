import { useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";
import axiosInstance from "../../api/apiInstance";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";


const documentSteps = [
    "FSSAI license",
    "GST number",
    "PAN card copy",
    "Bank account details",
];

const VendorKycPage = () => {
    const token = localStorage.getItem("accessToken");
    const vendor_id = localStorage.getItem("vendor_id");
    const navigate = useNavigate();


    const [vendor, setVendor] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [submittedSteps, setSubmittedSteps] = useState<string[]>([]);
    const [fssaiDetail, setFssaiDetail] = useState<any>({
        account_number: "",
        expiration_date: "",
        status: "pending",
        image: null,
    });

    const [gstDetail, setGstDetail] = useState<any>({
        gstn_number: "",
        expiration_date: "",
        status: "pending",
        image: null,
    });

    const [panDetail, setPanDetail] = useState<any>({
        pan_number: "",
        status: "pending",
        image: null,
    });

    const [bankDetail, setBankDetail] = useState<any>({
        bank_name: "",
        account_number: "",
        ifsc_code: "",
        status: "pending",
    });


    // Fetch vendor on mount
    useEffect(() => {
        const fetchVendor = async () => {
            if (!token || !vendor_id) {
                toast.error("Unauthorized access. Please login again.");
                setLoading(false);
                return;
            }

            try {
                const response = await axiosInstance("post", "/vendor/get", { vendor_id });
                const fetchedVendor = response?.data?.data?.[0] || null;

                if (!fetchedVendor) {
                    toast.error("Vendor data not found.");
                } else {
                    setVendor(fetchedVendor);
                }
            } catch (err) {
                console.error("Fetch vendor failed", err);
                toast.error("Something went wrong while fetching vendor data.");
            } finally {
                setLoading(false);
            }
        };

        fetchVendor();
    }, [token, vendor_id]);

    // When vendor is loaded, set the form details
    useEffect(() => {
        if (vendor) {
            setFssaiDetail({
                account_number: vendor?.fssai_detail?.account_number || "",
                expiration_date: vendor?.fssai_detail?.expiration_date || "",
                status: vendor?.fssai_detail?.status || "pending",
                image: null
            });

            setGstDetail({
                gstn_number: vendor?.gstn_detail?.gstn_number || "",
                expiration_date: vendor?.gstn_detail?.expiration_date || "",
                status: vendor?.gstn_detail?.status || "pending",
                image: null
            });

            setPanDetail({
                pan_number: vendor?.pan_detail?.pan_number || "",
                status: vendor?.pan_detail?.status || "pending",
                image: null
            });

            setBankDetail({
                bank_name: vendor?.bank_detail?.bank_name || "",
                account_number: vendor?.bank_detail?.account_number || "",
                ifsc_code: vendor?.bank_detail?.ifsc_code || "",
                status: vendor?.bank_detail?.status || "pending"
            });
        }
    }, [vendor]);

    const allDocsFilledAndPending = (
        fssaiDetail.account_number &&
        fssaiDetail.expiration_date &&
        fssaiDetail.status === "pending" &&
        gstDetail.gstn_number &&
        gstDetail.expiration_date &&
        gstDetail.status === "pending" &&
        panDetail.pan_number &&
        panDetail.status === "pending" &&
        bankDetail.bank_name &&
        bankDetail.account_number &&
        bankDetail.ifsc_code &&
        bankDetail.status === "pending"
    );

    const showPendingNotice = !vendor?.is_kyc_completed && allDocsFilledAndPending;


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, formName: string) => {
        e.preventDefault();
        if (loading || submittedSteps.includes(formName)) return;

        const restaurantId = localStorage.getItem("restaurant_id");
        if (!restaurantId) return;

        let key = "", dataToSend: any = {};
        const formData = new FormData();

        // VALIDATIONS
        const showError = (msg: string) => { toast.error(msg); return false; };

        if (formName === "FSSAI") {
            const { account_number, expiration_date, image } = fssaiDetail;
            if (!account_number || !expiration_date || !image) return showError("All FSSAI fields are required");
            key = "fssai_detail";
            dataToSend = { account_number, expiration_date, status: "pending" };
            formData.append("image", image);
        } else if (formName === "gst") {
            const { gstn_number, expiration_date, image } = gstDetail;
            if (!gstn_number || !expiration_date || !image) return showError("All GST fields are required");
            key = "gstn_detail";
            dataToSend = { gstn_number, expiration_date, status: "pending" };
            formData.append("image", image);
        } else if (formName === "PAN") {
            const { pan_number, image } = panDetail;
            if (!pan_number || !image) return showError("PAN number and image are required");
            key = "pan_detail";
            dataToSend = { pan_number, status: "pending" };
            formData.append("image", image);
        } else if (formName === "Bank") {
            const { bank_name, account_number, ifsc_code } = bankDetail;
            if (!bank_name || !account_number || !ifsc_code) return showError("All bank fields are required");
            key = "bank_detail";
            dataToSend = { bank_name, account_number, ifsc_code, status: "pending" };
        }

        formData.append("restaurant_id", restaurantId);
        formData.append("key", key);
        formData.append(key, JSON.stringify(dataToSend));

        try {
            setLoading(true);
            const response = await axiosInstance("post", "/vendor/update-kyc-detail", formData);
            console.log("Success:", response.data);
            toast.success("Submitted successfully!");
            setSubmittedSteps([...submittedSteps, formName]);
            const newSubmittedSteps = [...submittedSteps, formName];
            setSubmittedSteps(newSubmittedSteps);

            const requiredSteps = ["FSSAI", "gst", "PAN", "Bank"];
            const allSubmitted = requiredSteps.every(step => newSubmittedSteps.includes(step));

            if (allSubmitted) {
                window.location.href = "/kyc-submitted";
            }
            else {
                setCurrentStep((prev) => Math.min(prev + 1, documentSteps.length - 1));
            }
        } catch (error) {
            toast.error("Submission failed. Try again.");
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };
    const fssaiHasData =
        vendor?.fssai_detail?.account_number &&
        vendor?.fssai_detail?.expiration_date &&
        vendor?.fssai_detail?.image &&
        vendor?.fssai_detail?.status == "pending"; // allow resubmission if rejected

    const gstHasData =
        vendor?.gstn_detail?.gstn_number &&
        vendor?.gstn_detail?.expiration_date &&
        vendor?.gstn_detail?.image &&
        vendor?.gstn_detail?.status == "pending";

    const panHasData =
        vendor?.pan_detail?.pan_number &&
        vendor?.pan_detail?.image &&
        vendor?.pan_detail?.status == "pending";

    const bankHasData =
        vendor?.bank_detail?.bank_name &&
        vendor?.bank_detail?.account_number &&
        vendor?.bank_detail?.ifsc_code &&
        vendor?.bank_detail?.status == "pending";

    const renderSubmitButton = (formName: string) => {
        const isAlreadySubmitted =
            (formName === "FSSAI" && fssaiHasData) ||
            (formName === "gst" && gstHasData) ||
            (formName === "PAN" && panHasData) ||
            (formName === "Bank" && bankHasData);

        const isDisabled = loading || submittedSteps.includes(formName) || isAlreadySubmitted;

        return (
            <button
                type="submit"
                disabled={isDisabled}
                className={`px-4 py-2 text-white rounded ${isDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                    }`}
            >
                {loading
                    ? "Saving..."
                    : submittedSteps.includes(formName)
                        ? "Submitted"
                        : "Save"}
            </button>
        );
    };

    const renderFilePreview = (file: File | null) => {
        if (!file) return null;
        const url = URL.createObjectURL(file);
        return file.type.includes("image") ? (
            <img src={url} alt="Preview" className="h-40 mx-auto" />
        ) : (
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                View Uploaded Document
            </a>
        );
    };


    const handleBackToLogin = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("is_kyc_completed");
        localStorage.removeItem("vendor_id");
        localStorage.removeItem("restaurant_id");
        Cookies.remove("authToken");

        navigate("/"); // Go to home/login
    };

    return (
        <div className="min-h-screen bg-gray-100">

            <ToastContainer position="top-right" />
            <div className="bg-purple-600 p-6 flex items-center justify-between">
                <a onClick={handleBackToLogin} className="text-white text-lg font-bold">
                    <img src={logo} alt="Logo" className="w-16 cursor-pointer" />
                </a>

                <button
                    onClick={handleBackToLogin}
                    className="text-white  underline hover:text-purple-200 transition"
                >
                    Back to Login
                </button>

            </div>

            <div className="max-w-6xl mx-auto mt-8 flex gap-8 px-4">

                <div className="w-1/4 bg-white rounded-lg shadow p-4">

                    <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
                    <ul className="space-y-4">
                        {documentSteps.map((step, index) => (
                            <li
                                key={index}
                                className={`flex items-center gap-3 cursor-pointer ${index === currentStep ? "font-bold text-purple-600" : "text-gray-700"}`}
                                onClick={() => setCurrentStep(index)}
                            >
                                <div className={`w-4 h-4 rounded-full border-2 ${index === currentStep ? "bg-purple-600 border-purple-600" : "border-gray-400"}`}></div>
                                {step}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Form Section */}
                <div className="w-3/4 bg-white rounded-lg shadow p-6">
                    {showPendingNotice && (
                        <div
                            className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6"
                            role="alert"
                        >
                            <p className="font-bold">KYC Submitted & Pending Approval</p>
                            <p>
                                All your KYC documents have been submitted and are pending admin verification.
                            </p>
                            <p className="text-sm text-gray-500">
                                Need help?{" "}
                                <a href="mailto:dooitt31@gmail.com" className="text-blue-600 underline">
                                    Contact Admin
                                </a>
                            </p>
                        </div>
                    )}

                    {currentStep === 0 && (
                        <form onSubmit={(e) => handleSubmit(e, "FSSAI")}>
                            <h2 className="text-xl font-semibold mb-4">FSSAI Detail</h2>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <input
                                    placeholder="FSSAI Number"
                                    className="border p-2 rounded"
                                    value={fssaiDetail.account_number}
                                    onChange={(e) => setFssaiDetail({ ...fssaiDetail, account_number: e.target.value })}
                                />
                                <input
                                    type="date"
                                    className="border p-2 rounded"
                                    value={fssaiDetail.expiration_date}
                                    onChange={(e) => setFssaiDetail({ ...fssaiDetail, expiration_date: e.target.value })}
                                />
                            </div>
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => setFssaiDetail({ ...fssaiDetail, image: e.target.files?.[0] || null })}
                            />
                            <div className="mt-4">{renderFilePreview(fssaiDetail.image)}</div>
                            {/* <div className="flex justify-end gap-2 mt-6">{renderSubmitButton("FSSAI")}</div> */}
                            <div className="flex justify-between gap-2 mt-6">
                                {currentStep > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(currentStep - 1)}
                                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
                                    >
                                        Back
                                    </button>
                                )}
                                {renderSubmitButton("FSSAI")}
                            </div>

                        </form>
                    )}

                    {currentStep === 1 && (
                        <form onSubmit={(e) => handleSubmit(e, "gst")}>
                            <h2 className="text-xl font-semibold mb-4">GST Detail</h2>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <input
                                    placeholder="GST Number"
                                    className="border p-2 rounded"
                                    value={gstDetail.gstn_number}
                                    onChange={(e) => setGstDetail({ ...gstDetail, gstn_number: e.target.value })}
                                />
                                <input
                                    type="date"
                                    className="border p-2 rounded"
                                    value={gstDetail.expiration_date}
                                    onChange={(e) => setGstDetail({ ...gstDetail, expiration_date: e.target.value })}
                                />
                            </div>
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => setGstDetail({ ...gstDetail, image: e.target.files?.[0] || null })}
                            />
                            <div className="mt-4">{renderFilePreview(gstDetail.image)}</div>
                            {/* <div className="flex justify-end gap-2 mt-6">{renderSubmitButton("gst")}</div> */}
                            <div className="flex justify-between gap-2 mt-6">
                                {currentStep > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(currentStep - 1)}
                                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
                                    >
                                        Back
                                    </button>
                                )}
                                {renderSubmitButton("gst")}
                            </div>

                        </form>
                    )}

                    {currentStep === 2 && (
                        <form onSubmit={(e) => handleSubmit(e, "PAN")}>
                            <h2 className="text-xl font-semibold mb-4">PAN Detail</h2>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <input
                                    placeholder="PAN Number"
                                    className="border p-2 rounded"
                                    value={panDetail.pan_number}
                                    onChange={(e) => setPanDetail({ ...panDetail, pan_number: e.target.value })}
                                />
                            </div>
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => setPanDetail({ ...panDetail, image: e.target.files?.[0] || null })}
                            />
                            <div className="mt-4">{renderFilePreview(panDetail.image)}</div>
                            {/* <div className="flex justify-end gap-2 mt-6">{renderSubmitButton("PAN")}</div> */}
                            <div className="flex justify-between gap-2 mt-6">
                                {currentStep > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(currentStep - 1)}
                                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
                                    >
                                        Back
                                    </button>
                                )}
                                {renderSubmitButton("PAN")}
                            </div>
                        </form>
                    )}

                    {currentStep === 3 && (
                        <form onSubmit={(e) => handleSubmit(e, "Bank")}>
                            <h2 className="text-xl font-semibold mb-4">Bank Detail</h2>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <input
                                    placeholder="Bank Name"
                                    className="border p-2 rounded"
                                    value={bankDetail.bank_name}
                                    onChange={(e) => setBankDetail({ ...bankDetail, bank_name: e.target.value })}
                                />
                                <input
                                    placeholder="Account Number"
                                    className="border p-2 rounded"
                                    value={bankDetail.account_number}
                                    onChange={(e) => setBankDetail({ ...bankDetail, account_number: e.target.value })}
                                />
                                <input
                                    placeholder="IFSC"
                                    className="border p-2 rounded"
                                    value={bankDetail.ifsc_code}
                                    onChange={(e) => setBankDetail({ ...bankDetail, ifsc_code: e.target.value })}
                                />
                            </div>
                            {/* <div className="flex justify-end gap-2 mt-6">{renderSubmitButton("Bank")}</div> */}
                            <div className="flex justify-between gap-2 mt-6">
                                {currentStep > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(currentStep - 1)}
                                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
                                    >
                                        Back
                                    </button>
                                )}
                                {renderSubmitButton("Bank")}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorKycPage;
