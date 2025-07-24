import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bgImage from "../assets/images/bg-image.png";
import axiosInstance from "../api/apiInstance";
import OTPModal from "../components/modals/OTPModal";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";


const HomePage = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState(null);
  const [enteredOTP, setEnteredOTP] = useState("");

  const navigate = useNavigate();

  const isValidPhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);

  const handleLogin = async () => {
    setError("");
    if (!phone) {
      setError("Phone number is required.");
      return;
    }
    if (!isValidPhone(phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    try {
      const response = await axiosInstance("post", "/vendor", {
        phone: Number(phone),
      });

      if (response.data) {
        setGeneratedOTP(response.data.data.otp);
        toast.success("OTP sent successfully!");
        setShowOTP(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    }
  };

  const handleOTPVerify = async () => {
    setError("");
    if (!enteredOTP) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      const response = await axiosInstance("post", "/vendor/verify-otp", {
        phone: Number(phone),
        otp: Number(enteredOTP),
      });

      if (response.data.statusCode === 200) {
        toast.success(response?.data?.message || "Login successful");
        localStorage.setItem("accessToken", response?.data?.data?.access_token);
        Cookies.set("authToken", response?.data?.data?.access_token);
        setShowOTP(false);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("OTP verification failed. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setShowOTP(false);
    setEnteredOTP("");
    setError("");
  };

  return (
    <div className="font-sans text-gray-800">
      <Navbar />
      <section
        className="relative text-white min-h-screen flex flex-col justify-center items-start px-8 lg:px-24 pt-20 pb-12 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="max-w-xl bg-black bg-opacity-50 p-6 rounded z-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            BRING YOUR KITCHEN ONLINE — REACH THOUSANDS OF LOCAL FOODIES
          </h1>
        </div>

        <div className="absolute top-20 right-8 bg-white rounded-lg p-6 shadow-lg w-full max-w-sm z-20">
          <h2 className="text-xl font-semibold mb-4 text-black">Get Started</h2>

          <input
            type="tel"
            name="phone"
            placeholder="Enter 10-digit phone number"
            className="w-full text-black border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg mt-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >Sign In
          </button>
          <p className="text-sm mt-3 text-center text-gray-700">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-600 hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-6 lg:px-24 bg-white text-center">
        <h2 className="text-3xl font-bold mb-2">
          Get your restaurant live and ready for orders in 3 easy steps
        </h2>
        <p className="text-lg text-gray-600 mb-10">
          Start receiving orders within 24 hours!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
          <div>
            <h3 className="text-xl font-bold text-orange-500 mb-2">STEP 1</h3>
            <p>
              Download the DUUITT Restaurant App<br />Available on Android & iOS
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-yellow-500 mb-2">STEP 2</h3>
            <p>
              Sign in or create your account<br />Just use your mobile number and some details
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-purple-500 mb-2">STEP 3</h3>
            <p>
              Add your restaurant details & menu<br />We'll help you get listed and ready to serve
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* OTP Modal */}
      {showOTP && (
        <OTPModal
          phone={phone}
          backendOtp={generatedOTP}
          onClose={handleCloseModal}
          onVerify={handleOTPVerify}
          otp={enteredOTP}
          setOtp={setEnteredOTP}
          error={error}
        />
      )}
    </div>
  );
};

export default HomePage;