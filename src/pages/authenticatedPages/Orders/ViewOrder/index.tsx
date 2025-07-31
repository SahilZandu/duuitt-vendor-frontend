import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormatDate from "../../../../components/Ui/FormatDate";
import MenuIcon from "../../../../lib/MenuIcon";
import { fetchOrderById } from "../../../../api/OrderApi";
import PageTitle from "../../../../components/Ui/PageTitle";

const ViewOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  const getOrder = async () => {
    try {
      setLoading(true);
      const data = await fetchOrderById(id!);
      setOrder(data);
    } catch (err) {
      console.error("Failed to fetch order:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) getOrder();
  }, [id]);

  const statusLabel = {
    cooking: "Preparing",
    ready_to_pickup: "Ready for Pickup",
    packing_processing: "Packing",
    waiting_for_confirmation: "New",
    declined: "Declined",
    completed: "Completed",
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      <button
        onClick={() => navigate('/orders')}
        className="cursor-pointer inline-flex items-center text-base px-3 py-1 bg-gray-200 rounded-lg"
      >
        <span className="icon mr-2 text-lg">←</span>
        Back
      </button>
      <div className="flex flex-col my-4">
        <PageTitle title="Order Details" />
        <span className="text-sm font-medium text-gray-600">
          #{order?.order_id}
        </span>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{order?.user_name || "Sami"}</span>
        <div
          className={`inline-block mb-4 px-3 py-1 rounded-full text-white text-sm font-medium ${order?.status === "cooking"
            ? "bg-orange-500"
            : order?.status === "ready_to_pickup"
              ? "bg-green-500"
              : order?.status === "packing_processing"
                ? "bg-blue-500"
                : "bg-gray-400"
            }`}
        >
          {statusLabel[order?.status] || order?.status}
        </div>


      </div>
      <span className="text-sm text-gray-500">
        <FormatDate isoDate={order?.createdAt} />
      </span>

      <ul className="space-y-2">
        {order?.cartitems?.map((item, idx) => (
          <li
            key={idx}
            className="flex justify-between items-start border-b pb-1"
          >
            <div>
              <div className="flex items-center gap-2 text-sm">
                <MenuIcon
                  name={
                    item?.veg_non_veg?.toLowerCase() === "veg" ? "veg" : "nonVeg"
                  }
                />
                {item?.food_item_name} x {item?.quantity}
              </div>
              {item?.instructions && (
                <p className="text-xs text-gray-400 ml-6">{item?.instructions}</p>
              )}
            </div>
            <div className="text-sm">₹{item?.food_item_price}</div>
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Item total</span>
          <span>₹{order?.total_amount}</span>
        </div>
        <div className="flex justify-between">
          <span>Restaurant Charges</span>
          <span>₹{order?.restaurant_charge_amount || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>GST</span>
          <span>{order?.gst_percentage || 0}%</span>
        </div>
        <div className="flex justify-between">
          <span>Packing Charges</span>
          <span>₹{order?.packing_fee || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Platform Fee</span>
          <span>₹{order?.platform_fee || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;