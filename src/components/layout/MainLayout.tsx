import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSidebar } from "../../lib/Context/SidebarContext";

const MainLayout: React.FC = () => {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main
        className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
