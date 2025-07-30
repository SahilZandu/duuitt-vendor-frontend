import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import logo from "../../assets/images/logo.png"; // Adjust the path as needed

const KycSubmitted = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("is_kyc_completed");
    localStorage.removeItem("vendor_id");
    localStorage.removeItem("restaurant_id");
    Cookies.remove("authToken");

    navigate("/"); // Go to home/login
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Logo Header */}
      <div className="p-3 bg-purple-800">
        <img src={logo} alt="Logo" className="w-28" />
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-4xl text-green-500 mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">KYC Submitted</h2>
          <p className="text-gray-600 mb-4">
            Your KYC documents have been successfully submitted.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Our team is reviewing your information. This usually takes 24–48 hours.
          </p>
          <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded mb-4">
            <strong>Status:</strong> Pending Admin Approval
          </div>
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a href="mailto:support@example.com" className="text-blue-600 underline">
              Contact Admin
            </a>
          </p>

          {/* Back to login button */}
          <button
            onClick={handleBackToLogin}
            className="mt-6 text-purple-600 underline hover:text-purple-800 transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default KycSubmitted;
