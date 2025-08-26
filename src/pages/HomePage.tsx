import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/apiInstance";
import OTPModal from "../components/modals/OTPModal";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Footer from "../components/layout/Footer";
import Spinner from "../components/loader/Spinner";
import logo from "../assets/images/logo.png";
import { requestNotificationPermissionAndSendToken } from "../utils/firebase";
import { getOrCreateDeviceId } from "../utils/getOrCreateDeviceId";


const HomePage = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isVerfied, setIsVerifed] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState(null);
  const [enteredOTP, setEnteredOTP] = useState("");

  const navigate = useNavigate();

  // const isValidPhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);

  const handleLogin = async () => {
    setError("");

    if (!phone) {
      setError("Phone number is required.");
      return;
    }
    // if (!isValidPhone(phone)) {
    //   setError("Please enter a valid 10-digit mobile number.");
    //   return;
    // }
    setIsLoggingIn(true);
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
    } finally {
      setIsLoggingIn(false);
    }
  };

  // const handleOTPVerify = async () => {
  //   setError("");
  //   if (!enteredOTP) {
  //     setError("Please enter the OTP.");
  //     return;
  //   }

  //   setIsVerifed(true);

  //   try {
  //     const response = await axiosInstance("post", "/vendor/verify-otp", {
  //       phone: Number(phone),
  //       otp: Number(enteredOTP),
  //     });

  //     if (response.data.statusCode === 200) {
  //       toast.success(response?.data?.message || "Login successful");

  //       localStorage.setItem("accessToken", response?.data?.data?.access_token);
  //       console.log(response?.data?.data, ' this is the datajfdsajkfsdkjfadjkhdsfjkah')
  //       localStorage.setItem("restaurant_id", response?.data?.data?.restaurant?._id);
  //       Cookies.set("authToken", response?.data?.data?.access_token);


  //       const vendorProfile = response?.data?.data;
  //       localStorage.setItem("is_kyc_completed", vendorProfile?.is_kyc_completed);
  //       localStorage.setItem("vendor_id", vendorProfile?._id);
  //       const deviceId = getOrCreateDeviceId();
  //       await requestNotificationPermissionAndSendToken(vendorProfile, deviceId);

  //       console.log(vendorProfile, ' this is the venodr data');
  //       if (vendorProfile?.is_kyc_completed) {
  //         navigate("/dashboard");
  //       } else {
  //         navigate("/vendor-kyc");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("OTP verification error:", error);
  //     setError("OTP verification failed. Please try again.");
  //   } finally {
  //     setIsVerifed(false);
  //   }
  // };
  const handleOTPVerify = async () => {
    setError("");

    if (!enteredOTP) {
      setError("Please enter the OTP.");
      return;
    }

    setIsVerifed(true);

    try {
      const response = await axiosInstance("post", "/vendor/verify-otp", {
        phone: Number(phone),
        otp: Number(enteredOTP),
      });

      if (response.data.statusCode === 200) {
        toast.success(response?.data?.message || "Login successful");

        const userData = response?.data?.data;
        const isKycCompleted = !!userData?.is_kyc_completed;

        // Save tokens and IDs
        localStorage.setItem("accessToken", userData?.access_token);
        Cookies.set("authToken", userData?.access_token);
        localStorage.setItem("restaurant_id", userData?.restaurant?._id || "");
        localStorage.setItem("vendor_id", userData?._id || "");

        // Save vendor KYC status
        // localStorage.setItem("is_kyc_completed", userData?.is_kyc_completed || false);

        // Request FCM token
        const deviceId = getOrCreateDeviceId();
        await requestNotificationPermissionAndSendToken(userData, deviceId);

        // Navigate based on vendor KYC status
        if (isKycCompleted) {
          navigate("/dashboard");
        } else {
          navigate("/vendor-kyc");
        }

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
    <div className="font-sans text-gray-800">
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
              <img src={logo} alt="Logo" className="w-24" />
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
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Get Started</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter 10-digit phone number"
                  className="w-full text-black border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
              </div>
            </div>
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg mt-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoggingIn ? <Spinner /> : "Sign In"}
            </button>

            <p className="text-sm mt-3 text-center text-gray-700">
              Don't have an account?{" "}
              <Link to="/register" className="text-purple-600 hover:underline">
                Create account
              </Link>
            </p>
          </div>
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
          isVerfied={isVerfied}
        />
      )}
    </div>
  );
};

export default HomePage;