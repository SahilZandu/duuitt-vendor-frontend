import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
      <nav className="flex flex-col space-y-4">
        <Link to="/dashboard" className="hover:bg-gray-700 px-3 py-2 rounded">
          Dashboard
        </Link>
        <Link to="/profile" className="hover:bg-gray-700 px-3 py-2 rounded">
          Profile
        </Link>
        <Link to="/settings" className="hover:bg-gray-700 px-3 py-2 rounded">
          Settings
        </Link>
        <Link to="/logout" className="hover:bg-gray-700 px-3 py-2 rounded">
          Logout
        </Link>
      </nav>
    </aside>
  );
};
export default Sidebar;