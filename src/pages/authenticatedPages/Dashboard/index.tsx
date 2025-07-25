import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold text-blue-600">Total Users</h2>
          <p className="text-3xl font-bold mt-2">1,234</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
