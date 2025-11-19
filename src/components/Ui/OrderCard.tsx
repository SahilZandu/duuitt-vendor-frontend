// components/OrderCard.tsx
import React, { useState } from "react";
import type { Order } from "../../api/OrderApi";
import FormatDate from "./FormatDate";
import MenuIcon from "../../lib/MenuIcon";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

// Define strict union for statuses
import type { OrderStatus } from "../../types/types";

type ExtendedOrder = Order & {
    payment_status?: "captured" | "failed" | string;
    billing_detail: {
        total_amount: number;
        payment_status: "captured" | "failed" | string;
    };
    instructions?: string;
    cart_items: {
        food_item_name: string;
        quantity: number;
        food_item_price: number;
        veg_nonveg: string;
        varient_name?: string;
    }[];
    status: OrderStatus;
    restaurant?: {
        name?: string;
    };
    createdAt?: string;
    _id: string;
};

interface Props {
    order: ExtendedOrder;
    onStatusChange: (id: string, status: OrderStatus, time?: number) => void;
    onReject: (orderId: string) => Promise<void>;
    activeTab: string;
}

// Helper: badge color based on status
const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case "cooking":
            return "bg-green-500";
        case "ready_to_pickup":
            return "bg-orange-500";
        case "packing_processing": case "completed":
            return "bg-orange-500";
        case "waiting_for_confirmation":
            return "bg-blue-500";
        case "declined":
            return "bg-red-500";
        default:
            return "bg-gray-400";
    }
};

// Helper: label text based on status
const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
        case "cooking":
            return "Preparing";
        case "ready_to_pickup":
            return "Ready to Pickup";
        case "waiting_for_confirmation":
            return "New";
        case "packing_processing":
            return "Packing";
        case "completed":
            return "Completed";
        case "declined":
            return "Declined";
        default:
            return "Unknown";
    }
};

const OrderCard: React.FC<Props> = ({ order, onStatusChange, activeTab }) => {
    const [prepTime, setPrepTime] = useState<number | null>(20);
    const navigate = useNavigate();

    const isNewOrder = order.status === "waiting_for_confirmation";

    return (
        <div className={`relative bg-white rounded-2xl shadow-lg border-2 p-5 w-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
            isNewOrder
                ? "border-blue-500 animate-pulse-border ring-4 ring-blue-200 ring-opacity-50"
                : "border-gray-100"
        }`}>
            {/* New Order Badge */}
            {isNewOrder && (
                <div className="absolute -top-3 -right-3 z-10">
                    <div className="relative">
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg animate-bounce flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                            </svg>
                            NEW!
                        </div>
                        <span className="absolute top-0 right-0 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div className={`font-bold text-xs px-3 py-1.5 rounded-lg ${
                        isNewOrder
                            ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 animate-pulse"
                            : "bg-purple-50 text-purple-700"
                    }`}>
                        #{order?.order_id}
                    </div>
                </div>
                <div
                    className={`px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow-md ${getStatusColor(order.status)}`}
                >
                    {getStatusLabel(order?.status)}
                </div>
            </div>

            <div className="mb-2">
                <div className="text-lg font-bold text-gray-900">{order.restaurant?.name}</div>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <FormatDate isoDate={order.createdAt} />
                </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 mb-3">
                <ul className="space-y-2">
                    {order.cart_items.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2">
                                <MenuIcon name={item.veg_nonveg?.toLowerCase() === "veg" ? "veg" : "nonVeg"} />
                                <span className="font-medium text-gray-700">{item.food_item_name}</span>
                                <span className="text-gray-500">x {item.quantity}</span>
                            </span>
                            <span className="font-semibold text-gray-900">₹{item.food_item_price}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="border-t-2 border-dashed border-gray-200 pt-3 mb-3">
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        Total bill:
                        <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm ${(order?.billing_detail?.payment_status === "captured" || order?.payment_status === "captured")
                                ? "bg-green-100 text-green-700"
                                : (order?.billing_detail?.payment_status === "failed" || order?.payment_status === "failed")
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                        >
                            {
                                (order?.billing_detail?.payment_status === "captured" || order?.payment_status === "captured")
                                    ? "Paid"
                                    : (order?.billing_detail?.payment_status || order?.payment_status || "Pending")
                            }
                        </span>
                    </span>
                    <span className="text-xl font-bold text-gray-900">₹{Number(order?.billing_detail?.total_amount || order?.total_amount || 0).toFixed(2)}</span>
                </div>
            </div>

            {activeTab === "new" && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-3">
                    <span className="text-sm font-semibold text-purple-900">Set Preparing Time:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {[20, 25, 30, 40, 45].map((time) => (
                            <button
                                key={time}
                                onClick={() => setPrepTime(time)}
                                className={`px-3 py-2 text-xs font-semibold rounded-lg border-2 transition-all duration-200 ${
                                    prepTime === time
                                        ? "bg-purple-600 text-white border-purple-600 shadow-md"
                                        : "bg-white text-gray-700 border-gray-300 hover:border-purple-400"
                                }`}
                            >
                                {time} min
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {order?.instructions && (
                <div className="mb-3 bg-blue-50 border border-blue-200 p-3 text-xs text-blue-900 rounded-xl">
                    <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <strong className="font-semibold">Instructions:</strong> {order?.instructions || "No Instructions given!"}
                        </div>
                    </div>
                </div>
            )}


            <div className="mt-3">
                {activeTab === "new" ? (
                    <div className="flex gap-3">
                        <Button
                            onClick={() => prepTime && onStatusChange(order._id, "cooking", prepTime)}
                            label={`Accept Order (${prepTime} min)`}
                            variant="soft-success"
                        />
                        <Button
                            onClick={() => onStatusChange(order._id, "declined")}
                            label="Reject"
                            variant="danger"
                        />
                    </div>
                ) : activeTab === "cooking" ? (
                    <div className="flex justify-between gap-3">
                        <Button
                            label={order.cart_items.length > 2 ? "View More" : "View Details"}
                            variant="outline-success"
                            onClick={() => navigate(`/orders/view-order/${order?.order_id}`)}
                        />
                        <Button
                            onClick={() => onStatusChange(order._id, "packing_processing")}
                            label="Order Ready"
                            variant="soft-success"
                        />
                    </div>
                ) : activeTab === "packing" ? (
                    <div className="flex justify-between gap-3">
                        <Button
                            label={order.cart_items.length > 2 ? "View More" : "View Details"}
                            variant="outline-success"
                            onClick={() => navigate(`/orders/view-order/${order?.order_id}`)}
                        />
                        <Button
                            onClick={() => onStatusChange(order._id, "ready_to_pickup")}
                            label="Ready For Pickup"
                            variant="soft-success"
                        />
                    </div>
                ) : activeTab === "ready" ? (
                    <div className="flex flex-col gap-3">
                        <Button
                            label={order.cart_items.length > 2 ? "View More" : "View Details"}
                            variant="outline-success"
                            onClick={() => navigate(`/orders/view-order/${order?.order_id}`)}
                        />
                        <Button
                            disabled
                            label="Order Is Ready. Waiting For Rider Pickup."
                            variant="soft-success"
                        />
                    </div>
                ) : activeTab === "all" ? (
                    <div className="flex flex-col gap-3">
                        <Button
                            label={order.cart_items.length > 2 ? "View More" : "View Details"}
                            variant="primary-outline"
                            onClick={() => navigate(`/orders/view-order/${order?.order_id}`)}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default OrderCard;
