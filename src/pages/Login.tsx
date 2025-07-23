// src/pages/Login.tsx
import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/apiInstance";
import apiRequest from "../api/apiInstance";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await apiRequest("post", "/auth/login", { mobile });
      navigate("/verify", { state: { mobile } });
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg p-8 rounded max-w-sm w-full">
        <h1 className="text-xl font-bold mb-4">Get Started</h1>
        <Input
          placeholder="Enter your registered mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <Button label="Login" onClick={handleLogin} />
      </div>
    </div>
  );
};

export default Login;
