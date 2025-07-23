// src/pages/Login.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/apiInstance";
import bgImage from "../assets/images/bg-image.png";
import { toast } from "react-toastify";
import OTPModal from "../components/modals/OTPModal"; // Adjust path if needed
import Button from "../components/Button";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    restaurantName: "",
    phone: "",
    email: "",
    foundedDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showOTP, setShowOTP] = useState(false);
  const [enteredOTP, setEnteredOTP] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState(""); // If backend sends OTP

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidPhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);

  const handleRegister = async () => {
    const { name, restaurantName, phone, email, foundedDate } = formData;

    setError("");

    if (!name || !restaurantName || !phone || !email || !foundedDate) {
      setError("All fields are required.");
      return;
    }

    if (!isValidPhone(phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance("post", "/vendor/register", {
        name,
        restaurantName,
        phone: Number(phone),
        email,
        foundedDate,
      });

      if (response.status === 200) {
        toast.success("Registration successful! Please verify your OTP.");
        setGeneratedOTP(response.data?.otp || ""); // Optional if your backend sends it
        setShowOTP(true); // Show OTP modal
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowOTP(false);
  };

  const handleOTPVerify = () => {
    // Handle OTP verification logic here
    toast.success("OTP Verified!");
    setShowOTP(false);
    navigate("/dashboard"); // or wherever
  };

  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section
        className="relative text-white min-h-screen flex flex-col justify-center items-start px-8 lg:px-24 pt-20 pb-12 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="max-w-xl bg-black bg-opacity-50 p-6 rounded z-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            BRING YOUR KITCHEN ONLINE — REACH THOUSANDS OF LOCAL FOODIES
          </h1>
        </div>

        {/* Register Form */}
        <div className="absolute top-20 right-8 bg-white rounded-lg p-6 shadow-lg w-full max-w-sm z-20">
          <h2 className="text-xl font-semibold mb-4 text-black">Create Account</h2>

          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full border px-4 py-2 rounded-md"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="restaurantName"
              placeholder="Restaurant Name"
              className="w-full border px-4 py-2 rounded-md"
              value={formData.restaurantName}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Registered Phone Number"
              className="w-full border px-4 py-2 rounded-md"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full border px-4 py-2 rounded-md"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="date"
              name="foundedDate"
              placeholder="Date of Founding"
              className="w-full border px-4 py-2 rounded-md"
              value={formData.foundedDate}
              onChange={handleChange}
            />
          </div>

          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

          <Button label={loading ? "Please wait..." : "Register"} onClick={handleRegister} disabled={loading} />

          <p className="text-sm mt-3 text-center text-gray-700">
            Already have an account?{" "}
            <Link to="/" className="text-purple-600 hover:underline">
              Sign In
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
              Download the DUUITT Restaurant App
              <br />
              Available on Android & iOS
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-yellow-500 mb-2">STEP 2</h3>
            <p>
              Sign in or create your account
              <br />
              Just use your mobile number and some details
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-purple-500 mb-2">STEP 3</h3>
            <p>
              Add your restaurant details & menu
              <br />
              We'll help you get listed and ready to serve
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-700 text-white py-10 px-6 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-sm">
          <div className="col-span-1">
            <div className="text-3xl font-bold mb-2">DUUITT</div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">For Restaurants</h4>
            <p>Partner With Us</p>
            <a
              href="https://drive.google.com/file/d/1VRzcB28w3yfe8-gRC70m8fqj4EGe9LAt/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline"
            >
              Download App
            </a>
          </div>
          <div>
            <h4 className="font-semibold mb-2">For Delivery Partners</h4>
            <p>Partner With Us</p>
            <a
              href="https://drive.google.com/file/d/1NDMuQOHo2X21gg3X04aN_jMtOAcSe80Z/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline"
            >
              Download App
            </a>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Learn More</h4>
            <p>Terms & Conditions</p>
            <p>Privacy Policy</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Social Links</h4>
            <div className="flex gap-2">
              <span>○</span>
              <span>○</span>
              <span>○</span>
              <span>○</span>
            </div>
          </div>
        </div>
        <p className="text-center mt-6 text-sm">Copyright © 2025 Duuitt</p>
      </footer>

      {/* OTP Modal */}
      {/* {showOTP && (
        <OTPModal
          phone={formData.phone}s
          backendOtp={generatedOTP}
          onClose={handleCloseModal}
          onVerify={handleOTPVerify}
          otp={enteredOTP}
          setOtp={setEnteredOTP}
          error={error}
        />
      )} */}
    </div>
  );
};

export default Register;
