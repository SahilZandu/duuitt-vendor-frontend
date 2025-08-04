import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormatDate from "../../../../components/Ui/FormatDate";
import MenuIcon from "../../../../lib/MenuIcon";
import { fetchOrderById } from "../../../../api/OrderApi";
import PageTitle from "../../../../components/Ui/PageTitle";
import Loader from "../../../../components/loader/Loader";

// Strict statusLabel with inferred key types
const statusLabel = {
  cooking: "Preparing",
  ready_to_pickup: "Ready for Pickup",
  packing_processing: "Packing",
  waiting_for_confirmation: "New",
  declined: "Declined",
  completed: "Completed",
} as const;

// Cart item type
type CartItem = {
  food_item_name: string;
  quantity: number;
  food_item_price: number;
  veg_non_veg: string;
  instructions?: string;
};

// Order type
type OrderType = {
  order_id: string;
  user_name: string;
  status: keyof typeof statusLabel;
  createdAt: string;
  cartitems: CartItem[];
  total_amount: number;
  restaurant_charge_amount?: number;
  gst_percentage?: number;
  packing_fee?: number;
  platform_fee?: number;
};

const ViewOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <Loader />;
  }

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
          {order?.status && statusLabel[order.status]}
        </div>
      </div>

      <span className="text-sm text-gray-500">
        {order?.createdAt && <FormatDate isoDate={order.createdAt} />}
      </span>

      <ul className="space-y-2">
        {order?.cartitems?.map((item: CartItem, idx: number) => (
          <li
            key={idx}
            className="flex justify-between items-start border-b pb-1"
          >
            <div>
              <div className="flex items-center gap-2 text-sm">
                <MenuIcon
                  name={item.veg_non_veg.toLowerCase() === "veg" ? "veg" : "nonVeg"}
                />
                {item.food_item_name} x {item.quantity}
              </div>
              {item.instructions && (
                <p className="text-xs text-gray-400 ml-6">{item.instructions}</p>
              )}
            </div>
            <div className="text-sm">₹{item.food_item_price}</div>
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