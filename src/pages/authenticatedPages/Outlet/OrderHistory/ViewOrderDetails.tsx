// // import { useEffect, useState } from "react";
// // import { useNavigate, useParams } from "react-router-dom";
// // import { fetchOrderById } from "../../../../api/OrderApi";

// // const ViewOrderDetails = () => {
// //     const { id } = useParams();
// //     const [order, setOrder] = useState<any>(null);
// //     const navigate = useNavigate();
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState<string | null>(null);

// //     const getOrder = async () => {
// //         try {
// //             setLoading(true);
// //             const data = await fetchOrderById(id!);
// //             setOrder(data);
// //         } catch (err) {
// //             console.error("Failed to fetch order:", err);
// //             setError("Failed to fetch order details.");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     useEffect(() => {
// //         if (id) getOrder();
// //     }, [id]);

// //     if (loading) return <div className="p-4">Loading order details...</div>;
// //     if (error) return <div className="p-4 text-red-500">{error}</div>;
// //     if (!order) return <div className="p-4">No order found.</div>;

// //     return (
// //         <div className="max-w-5xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-md">
// //             <button
// //                 onClick={() => navigate('/outlet/order-history')}
// //                 className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
// //             >
// //                 <span className="mr-2">←</span> Back
// //             </button>

// //             <h2 className="text-2xl font-bold text-gray-800">
// //                 Order Details - #{order?.invoice_no || 'N/A'}
// //             </h2>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
// //                 <div><span className="font-semibold">Status:</span> {order?.status || 'N/A'}</div>
// //                 <div><span className="font-semibold">Order ID:</span> {order?.order_id || 'N/A'}</div>
// //                 <div><span className="font-semibold">Payment:</span> {order?.payment_method_id || 'N/A'} ({order?.payment_status || 'N/A'})</div>
// //                 <div><span className="font-semibold">Total:</span> ₹{order?.total_amount?.toFixed(2) || '0.00'}</div>
// //                 <div>
// //                     <span className="font-semibold">Customer:</span> {order?.delivery_address?.name || 'N/A'} ({order?.delivery_address?.phone || 'N/A'})
// //                 </div>
// //                 <div>
// //                     <span className="font-semibold">Address:</span> {order?.delivery_address?.address_detail || 'N/A'}, {order?.delivery_address?.address || 'N/A'}
// //                 </div>

// //                 {(order?.status === "cancelled" || order?.status === "declined") && (
// //                     <>
// //                         <div className="text-red-600">
// //                             <strong>Cancellation Reason:</strong> {order?.reason_of_cancellation || "N/A"}
// //                         </div>
// //                         <div>
// //                             <strong>Refund Status:</strong> {order?.refund_status || "N/A"}
// //                         </div>
// //                     </>
// //                 )}
// //             </div>

// //             <div>
// //                 <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Ordered Items:</h3>
// //                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
// //                     {order?.cartitems?.length > 0 ? (
// //                         order.cartitems.map((item: any, idx: number) => (
// //                             <li key={idx} className="p-4 border rounded bg-gray-50 flex">
// //                                 <div className="w-1/2">
// //                                     <img
// //                                         src={
// //                                             item?.food_item_image
// //                                                 ? `${import.meta.env.VITE_BACKEND_BASE_URL}${item.food_item_image}`
// //                                                 : "/public/images/default-food-image.png"
// //                                         }
// //                                         alt={item?.food_item_name || "Food Image"}
// //                                         className="w-full h-36 object-cover rounded"
// //                                         // onError={(e) => {
// //                                         //     e.currentTarget.onerror = null;
// //                                         //     e.currentTarget.src = "/public/images/default-food-image.png";
// //                                         // }}
// //                                          crossOrigin="anonymous"
// //                                     />
// //                                 </div>

// //                                 <div className="p-4 space-y-2">
// //                                     <div className="text-lg font-semibold text-gray-800">
// //                                         {item?.food_item_name || 'N/A'}
// //                                     </div>
// //                                     <div className="text-sm text-gray-600">Quantity: {item?.quantity || 0}</div>
// //                                     <div className="text-sm text-gray-600">Price: ₹{item?.food_item_price || '0.00'}</div>

// //                                     {item?.selected_add_on?.length > 0 && (
// //                                         <div className="text-sm text-gray-700">
// //                                             <strong>Addons:</strong>
// //                                             <ul className="list-disc ml-5 mt-1">
// //                                                 {item.selected_add_on.map((addon: any, i: number) => (
// //                                                     <li key={i}>
// //                                                         {addon?.addon_name || 'N/A'} - ₹{addon?.addon_price || '0.00'}
// //                                                     </li>
// //                                                 ))}
// //                                             </ul>
// //                                         </div>
// //                                     )}
// //                                 </div>
// //                             </li>
// //                         ))
// //                     ) : (
// //                         <li className="text-gray-500">No items found in cart.</li>
// //                     )}
// //                 </ul>
// //             </div>
// //         </div>
// //     );

// // };

// // export default ViewOrderDetails;

// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import FormatDate from "../../../../components/Ui/FormatDate";
// import MenuIcon from "../../../../lib/MenuIcon";
// import { fetchOrderById } from "../../../../api/OrderApi";
// import PageTitle from "../../../../components/Ui/PageTitle";
// import Loader from "../../../../components/loader/Loader";

// // Strict statusLabel with inferred key types
// const statusLabel = {
//     cooking: "Preparing",
//     ready_to_pickup: "Ready for Pickup",
//     packing_processing: "Packing",
//     waiting_for_confirmation: "New",
//     declined: "Declined",
//     completed: "Completed",
// } as const;

// // Cart item type
// type CartItem = {
//     food_item_name: string;
//     quantity: number;
//     food_item_price: number;
//     veg_non_veg: string;
//     instructions?: string;
// };

// // Order type
// type OrderType = {
//     order_id: string;
//     user_name: string;
//     status: keyof typeof statusLabel;
//     createdAt: string;
//     cartitems: CartItem[];
//     total_amount: number;
//     restaurant_charge_amount?: number;
//     gst_percentage?: number;
//     packing_fee?: number;
//     platform_fee?: number;
//     after_discount_sub_amt?: number;
//     distance_from_customer?: number;
//     coupon_amount?: number;
//     delivery_fee?: number;
//     original_total_amount?: number;
//     payment_status?: number;
// };

// const ViewOrderDetails = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [order, setOrder] = useState<OrderType | null>(null);
//     console.log({order});
    
//     const [loading, setLoading] = useState(true);

//     const getOrder = async () => {
//         try {
//             setLoading(true);
//             const data = await fetchOrderById(id!);
//             setOrder(data);
//         } catch (err) {
//             console.error("Failed to fetch order:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (id) getOrder();
//     }, [id]);

//     if (loading) {
//         return <Loader />;
//     }

//     return (
//         <div className="p-4 bg-white min-h-screen">
//             <button
//                 onClick={() => navigate('/orders')}
//                 className="cursor-pointer inline-flex items-center text-base px-3 py-1 bg-gray-200 rounded-lg"
//             >
//                 <span className="icon mr-2 text-lg">←</span>
//                 Back
//             </button>

//             <div className="flex flex-col">
//                 <PageTitle title="Order Details" />
//             </div>

//             <div className="flex items-center justify-between mb-2">
//                 <span className="text-lg font-medium font-bold">
//                     #{order?.order_id}
//                 </span>
//                 <div
//                     className={`inline-block mb-4 px-3 py-1 rounded-full text-white text-sm font-medium ${order?.status === "cooking"
//                             ? "bg-green-500"
//                             : order?.status === "ready_to_pickup"
//                                 ? "bg-orange-500"
//                                 : order?.status === "packing_processing"
//                                     ? "bg-blue-500"
//                                     : order?.status === "completed"
//                                         ? "bg-purple-500"
//                                         : "bg-gray-400"
//                         }`}
//                 >
//                     {order?.status && statusLabel[order.status]}
//                 </div>

//             </div>
//             {/* <span className="text-sm font-medium">{order?.user_name || "Sami"}</span> */}

//             <span className="text-sm text-gray-500">
//                 {order?.createdAt && <FormatDate isoDate={order.createdAt} />}
//             </span>

//             <ul className="space-y-2">
//                 {order?.cartitems?.map((item: CartItem, idx: number) => (
//                     <li
//                         key={idx}
//                         className="flex justify-between items-start border-b border-dashed pb-1"
//                     >
//                         <div>
//                             <div className="flex items-center gap-2 text-sm">
//                                 <MenuIcon
//                                     name={item.veg_non_veg.toLowerCase() === "veg" ? "veg" : "nonVeg"}
//                                 />
//                                 {item.food_item_name} x {item.quantity}
//                             </div>
//                             {item.instructions && (
//                                 <p className="text-xs text-gray-400 ml-6">{item.instructions}</p>
//                             )}
//                         </div>
//                         <div className="text-sm">₹{item.food_item_price}</div>
//                     </li>
//                 ))}
//             </ul>

//             <div className="mt-4 pt-4 space-y-2 text-sm">
//                 <div className="flex justify-between">
//                     <span>Item total</span>
//                     <span>₹{order?.after_discount_sub_amt}</span>
//                 </div>
//                 <div className="flex justify-between">
//                     <span>Restaurant Charges</span>
//                     <span>₹{order?.restaurant_charge_amount || 0}</span>
//                 </div>
//                 <div className="flex justify-between">
//                     <span>Management Charges</span>
//                     <span>₹{order?.distance_from_customer || 0}</span>
//                 </div>
//                 <div className="flex justify-between">
//                     <span>Packing Charges</span>
//                     <span>₹{order?.packing_fee || 0}</span>
//                 </div>
//                 <div className="flex justify-between">
//                     <span>Platform Fee</span>
//                     <span>₹{order?.packing_fee || 0}</span>
//                 </div>
//                 <div className="flex justify-between">
//                     <span>Discount</span>
//                     <span>₹{order?.coupon_amount || 0}</span>
//                 </div>

//                 <div className="flex justify-between">
//                     <span>Delivery Charges</span>
//                     <span>₹{order?.delivery_fee || 0}</span>
//                 </div>
//                 <div className="flex justify-between border-b border-t border-dashed py-4">
//                     <span className="text-lg font-medium">Grand Total</span>
//                     <span className="text-lg font-medium">₹{order?.original_total_amount || 0}</span>
//                 </div>
//                 <div className="mt-2 pt-2 text-sm font-medium flex justify-between">
//                     <span className="flex items-center gap-2">
//                         Total bill:
//                         <span
//                             className={`px-2 py-1 rounded text-xs font-semibold ${String(order?.payment_status) === "captured"
//                                 ? "bg-gray-100 text-gray-700"
//                                 : String(order?.payment_status) === "failed"
//                                     ? "bg-red-100 text-red-700"
//                                     : "bg-gray-100 text-gray-700"
//                                 }`}
//                         >
//                             {String(order?.payment_status) === "captured" ? "Paid" : "Pending"}
//                         </span>

//                     </span>
//                     <span>₹{Number(order?.total_amount || 0).toFixed(2)}</span>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default ViewOrderDetails;
