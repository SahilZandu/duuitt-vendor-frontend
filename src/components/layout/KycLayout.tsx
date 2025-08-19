import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const KycLayout: React.FC = () => {
  const navigate = useNavigate();
    const handleBackToLogin = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("is_kyc_completed");
        localStorage.removeItem("vendor_id");
        localStorage.removeItem("restaurant_id");
        // Cookies.remove("authToken");
        navigate("/");
    };
    return (
        <div className="">
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

            {/* Main Content */}
            <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default KycLayout;
