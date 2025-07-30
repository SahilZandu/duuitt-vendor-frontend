import { useState } from "react";
import Footer from "../components/layout/Footer";
import axiosInstance from "../api/apiInstance";
import OTPModal from "../components/modals/OTPModal";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

const Register = () => {
  const [isVerfied, setIsVerifed] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    restaurant_name: "",
    phone: "",
    email: "",
    date_of_founding: "",
  });
  const [showOTP, setShowOTP] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState(null);
  const [enteredOTP, setEnteredOTP] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidPhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);

  const handleRegister = async () => {
    const { name, restaurant_name, phone, email, date_of_founding } = formData;
    setError("");
  
    if (!name || !restaurant_name || !phone || !email || !date_of_founding) {
      setError("All fields are required.");
      return;
    }
  
    if (!isValidPhone(phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axiosInstance("post", "/vendor/sign-up", formData);
  
      const { data, statusCode, message } = response.data;
  
      if (statusCode !== 200 || !data) {
        toast.error(message || "Something went wrong.");
        setLoading(false);
        return;
      }
  
      // success
      setGeneratedOTP(data.otp);
      toast.success("OTP sent successfully!");
      setShowOTP(true);
  
      setTimeout(() => {
        console.log("Registration successful", formData);
        setLoading(false);
      }, 2000);
    } catch (err: any) {
      console.error("Registration error:", err);
      setLoading(false);
      const message =
        err?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(message);
    }
  };
  


  const handleOTPVerify = async () => {
    setError("");
    if (!enteredOTP) {
      setError("Please enter the OTP.");
      return;
    }
    setIsVerifed(true);
    try {
      const response = await axiosInstance("post", "/vendor/verify-otp", {
        phone: Number(formData.phone),
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
    } finally {
      setIsVerifed(false);
    }
  };
  const handleCloseModal = () => {
    setShowOTP(false);
    setEnteredOTP("");
    setError("");
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Form */}
      <section className="relative min-h-screen bg-gradient-to-r from-black via-gray-900 to-black">
        {/* Background with food image overlay */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        <div className="relative z-10 flex min-h-screen">
          {/* Left side - Logo and Headline */}
          <div className="flex-1 flex flex-col justify-center px-8 lg:px-16">
            {/* Logo */}
            <div className="mb-12">
              <div className="mb-12">
                <img src={logo} alt="Logo" className="w-24" />
              </div>
            </div>

            {/* Main Headline */}
            <div className="max-w-2xl">
              <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-8">
                BRING YOUR KITCHEN ONLINE — REACH THOUSANDS OF LOCAL FOODIES
              </h1>
            </div>
          </div>

          {/* Right side - Registration Form */}
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl m-8 p-8 h-fit self-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Account</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  name="restaurant_name"
                  placeholder="Enter restaurant name"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  value={formData.restaurant_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registered Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter 10-digit phone number"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="date_of_founding"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  value={formData.date_of_founding}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600 mt-3 p-2 bg-red-50 rounded">{error}</p>}

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg mt-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="text-sm mt-4 text-center text-gray-600">
              Already have an account?{" "}
              <a href="/" className="text-purple-600 hover:underline font-medium">
                Login
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-16 px-8 lg:px-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Quick Tip: Keep These Docs Ready Before You Start
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Keep these ready so you can breeze through the setup:
          </p>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-gray-800 font-medium">FSSAI license</span>
                <span className="text-gray-500 ml-2">Don't have a FSSAI license?</span>
                <a href="#" className="text-purple-600 hover:underline ml-1 font-medium">Apply here</a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span className="text-gray-800 font-medium">GST number, if applicable</span>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span className="text-gray-800 font-medium">Your restaurant menu</span>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span className="text-gray-800 font-medium">PAN card copy</span>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span className="text-gray-800 font-medium">Bank account details</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      {showOTP && (
        <OTPModal
          phone={formData.phone}
          backendOtp={generatedOTP}
          onClose={handleCloseModal}
          onVerify={handleOTPVerify}
          otp={enteredOTP}
          setOtp={setEnteredOTP}
          error={error}
          isVerfied={isVerfied}
        />
      )}
    </div>
  );
};

export default Register;