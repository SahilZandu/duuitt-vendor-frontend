import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 bg-purple-100 min-h-screen">
      {/* Top Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total Orders", value: 21, color: "blue-400" },
          { label: "Total Delivered", value: 500, color: "yellow-400" },
          { label: "Total Revenue", value: "₹1,29,750", color: "green-400" },
          { label: "Total Products", value: 38, color: "indigo-400" },
          { label: "Total Cancelled", value: 125, color: "red-400" },
        ].map((card, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl p-4 shadow-md flex flex-col items-center`}
          >
            <div className={`w-10 h-10 rounded-full bg-${card.color} flex items-center justify-center text-white text-lg`}>
              ●
            </div>
            <h3 className="text-md text-gray-600 mt-2">{card.label}</h3>
            <p className="text-xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Orders Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Orders */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-bold mb-4">New Orders</h2>
          {[1, 2, 3].map((orderId) => (
            <div key={orderId} className="border border-gray-200 rounded-md p-4 mb-4">
              <p className="text-sm text-gray-500 font-medium">#OID987654{orderId}</p>
              <p className="text-sm text-gray-600 mt-1">Store: FoodPlace</p>
              <div className="text-sm text-gray-700 mt-2">
                <p>✓ Paneer Pizza x1</p>
                <p>✓ French Fries x1</p>
              </div>
              <p className="text-sm mt-2 font-medium">Total: ₹450</p>
              <div className="flex justify-between mt-3">
                <input
                  type="time"
                  className="border rounded-md px-2 py-1 text-sm"
                  placeholder="Set time"
                />
                <div className="flex gap-2">
                  <button className="px-4 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition">
                    Accept Order
                  </button>
                  <button className="px-4 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-bold mb-4">Order Details</h2>
          <div className="border border-gray-200 rounded-md p-4">
            <p className="text-sm text-gray-500 font-medium">#OID98765421</p>
            <p className="text-sm text-gray-600 mt-1">Store: FoodPlace</p>
            <div className="text-sm text-gray-700 mt-2">
              <p>✓ Paneer Pizza x1</p>
              <p>✓ French Fries x1</p>
            </div>
            <p className="text-sm mt-2 font-medium">Total: ₹450</p>
            <div className="flex justify-between mt-3">
              <input
                type="time"
                className="border rounded-md px-2 py-1 text-sm"
                placeholder="Set time"
              />
              <div className="flex gap-2">
                <button className="px-4 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition">
                  Accept Order
                </button>
                <button className="px-4 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition">
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
