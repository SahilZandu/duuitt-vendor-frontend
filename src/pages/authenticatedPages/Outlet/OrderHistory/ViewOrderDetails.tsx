import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchOrderById } from "../../../../api/OrderApi";

const ViewOrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState<any>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getOrder = async () => {
        try {
            setLoading(true);
            const data = await fetchOrderById(id!);
            setOrder(data);
        } catch (err) {
            console.error("Failed to fetch order:", err);
            setError("Failed to fetch order details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) getOrder();
    }, [id]);

    if (loading) return <div className="p-4">Loading order details...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!order) return <div className="p-4">No order found.</div>;

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-md">
            <button
                onClick={() => navigate('/outlet/order-history')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
                <span className="mr-2">←</span> Back
            </button>

            <h2 className="text-2xl font-bold text-gray-800">
                Order Details - #{order?.invoice_no || 'N/A'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div><span className="font-semibold">Status:</span> {order?.status || 'N/A'}</div>
                <div><span className="font-semibold">Order ID:</span> {order?.order_id || 'N/A'}</div>
                <div><span className="font-semibold">Payment:</span> {order?.payment_method_id || 'N/A'} ({order?.payment_status || 'N/A'})</div>
                <div><span className="font-semibold">Total:</span> ₹{order?.total_amount?.toFixed(2) || '0.00'}</div>
                <div>
                    <span className="font-semibold">Customer:</span> {order?.delivery_address?.name || 'N/A'} ({order?.delivery_address?.phone || 'N/A'})
                </div>
                <div>
                    <span className="font-semibold">Address:</span> {order?.delivery_address?.address_detail || 'N/A'}, {order?.delivery_address?.address || 'N/A'}
                </div>

                {(order?.status === "cancelled" || order?.status === "declined") && (
                    <>
                        <div className="text-red-600">
                            <strong>Cancellation Reason:</strong> {order?.reason_of_cancellation || "N/A"}
                        </div>
                        <div>
                            <strong>Refund Status:</strong> {order?.refund_status || "N/A"}
                        </div>
                    </>
                )}
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Ordered Items:</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {order?.cartitems?.length > 0 ? (
                        order.cartitems.map((item: any, idx: number) => (
                            <li key={idx} className="p-4 border rounded bg-gray-50 flex">
                                <div className="w-1/2">
                                    <img
                                        src={
                                            item?.food_item_image
                                                ? `${import.meta.env.VITE_BACKEND_BASE_URL}${item.food_item_image}`
                                                : "/public/images/default-food-image.png"
                                        }
                                        alt={item?.food_item_name || "Food Image"}
                                        className="w-full h-36 object-cover rounded"
                                        // onError={(e) => {
                                        //     e.currentTarget.onerror = null;
                                        //     e.currentTarget.src = "/public/images/default-food-image.png";
                                        // }}
                                         crossOrigin="anonymous"
                                    />
                                </div>

                                <div className="p-4 space-y-2">
                                    <div className="text-lg font-semibold text-gray-800">
                                        {item?.food_item_name || 'N/A'}
                                    </div>
                                    <div className="text-sm text-gray-600">Quantity: {item?.quantity || 0}</div>
                                    <div className="text-sm text-gray-600">Price: ₹{item?.food_item_price || '0.00'}</div>

                                    {item?.selected_add_on?.length > 0 && (
                                        <div className="text-sm text-gray-700">
                                            <strong>Addons:</strong>
                                            <ul className="list-disc ml-5 mt-1">
                                                {item.selected_add_on.map((addon: any, i: number) => (
                                                    <li key={i}>
                                                        {addon?.addon_name || 'N/A'} - ₹{addon?.addon_price || '0.00'}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500">No items found in cart.</li>
                    )}
                </ul>
            </div>
        </div>
    );

};

export default ViewOrderDetails;
