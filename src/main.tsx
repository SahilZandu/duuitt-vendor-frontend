// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { VendorProvider } from "./lib/Context/VendorContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <VendorProvider>
        <App />
      </VendorProvider>
      <ToastContainer position="top-right" autoClose={2000} />
    </BrowserRouter>
  </React.StrictMode>
);
