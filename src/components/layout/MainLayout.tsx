import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const MainLayout: React.FC = () => {

  return (
    <div className="flex min-h-screen">
      {/* Fixed Sidebar */}
      <aside className="w-64 h-screen sticky top-0 left-0 bg-white shadow z-10">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
