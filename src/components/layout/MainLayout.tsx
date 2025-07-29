import React from "react";
import { Outlet } from "react-router-dom";
// import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navbar /> */}

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;
