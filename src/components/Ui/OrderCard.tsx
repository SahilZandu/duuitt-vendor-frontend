// components/OrderCard.tsx
import React, { useState } from "react";
import type { Order } from "../../api/OrderApi";
import FormatDate from "./FormatDate";
import MenuIcon from "../../lib/MenuIcon";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
type ExtendedOrder = Order & {
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
    }[];
    status:
    | "waiting_for_confirmation"
    | "cooking"
    | "packing_processing"
    | "ready_to_pickup"
    | "declined"
    | "completed"
    | string;
    restaurant?: {
        landmark?: string;
    };
    createdAt?: string;
    _id: string;
};


interface Props {
    order: ExtendedOrder;
    onStatusChange: (id: string, status: string, time?: number) => void;
    onReject: (id: string) => void;
    activeTab: any;
}

const OrderCard: React.FC<Props> = ({ order, onStatusChange, onReject, activeTab }) => {
    const [prepTime, setPrepTime] = useState<number | null>(20);
    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-md">
            <div className="flex justify-between">
                <div className="text-sm text-gray-500">#{order?._id}</div>
                <div
                    className={`px-2 py-1 rounded-[20px] text-white text-sm font-medium ${order?.status === "cooking"
                        ? "bg-orange-500"
                        : order?.status === "ready_to_pickup"
                            ? "bg-green-500" : order?.status === "packing_processing"
                                ? "bg-green-500"
                                : order?.status === "waiting_for_confirmation"
                                    ? "bg-blue-500"
                                    : "bg-gray-400"
                        }`}
                >
                    {order?.status === "cooking"
                        ? "Preparing"
                        : order?.status === "ready_to_pickup"
                            ? "Ready to Pickup"
                            : order?.status === "waiting_for_confirmation"
                                ? "New" : order?.status === "packing_processing"
                                    ? "Packing Processing"
                                    : order?.status || "Unknown"}
                </div>

            </div>

            <div className="text-md font-semibold">{order?.restaurant?.landmark}</div>
            <div className="text-xs text-gray-400">
                <FormatDate isoDate={order?.createdAt} /> </div>

            <ul className="mt-2 space-y-1 text-sm">
                {order?.cart_items.slice(0, 2)?.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                        {/* Veg/Non-Veg indicator */}
                        <span className="flex items-center gap-2">
                            <MenuIcon name={item?.veg_nonveg?.toLowerCase() === "veg" ? "veg" : "nonVeg"} />
                            <span>{item?.food_item_name} x {item.quantity}</span>
                        </span>

                        {/* Price */}
                        <span>₹{item?.food_item_price}</span>
                    </li>
                ))}
            </ul>

            <div className="mt-2 border-t pt-2 text-sm font-medium flex justify-between">
                <span className="flex items-center gap-2">
                    Total bill:
                    <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${order?.billing_detail?.payment_status === "captured"
                            ? "bg-green-100 text-green-700"
                            : order?.billing_detail?.payment_status === "failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                    >
                        {order?.billing_detail?.payment_status === "captured"
                            ? "Paid"
                            : order?.billing_detail?.payment_status || "Unknown"}
                    </span>
                </span>

                <span>₹{Number(order?.billing_detail?.total_amount).toFixed(2)}</span>
            </div>

            {/* {order?.instructions && ( */}

            {/* )} */}
            {activeTab === "new" && (
                <div>
                    <span>Set Food Preparing Time:</span>
                    <div className="mt-3 flex flex-wrap gap-2">

                        {[20, 25, 30, 40, 45].map((time) => (
                            <button
                                key={time}
                                onClick={() => setPrepTime(time)}
                                className={`px-2 py-1 text-xs rounded border ${prepTime === time ? "bg-green-200 border-green-500" : "border-gray-300"
                                    }`}
                            >
                                {time} min
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <div className="mt-2 bg-gray-100 p-2 text-xs text-gray-700 rounded">
                <strong>Instructions:</strong> {order?.instructions || "No Instructions given!"}
            </div>
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
                            label={order?.cart_items?.length > 2 ? "View More" : "View Details"}
                            variant="outline-success"
                            onClick={() => navigate(`/orders/view-order/${order?.order_id}`)}
                        />
                        <Button
                            onClick={() => onStatusChange(order?._id, "packing_processing")}
                            label="Order Ready"
                            variant="soft-success"
                        />
                    </div>
                ) : activeTab === "packing" ? (
                    <div className="flex justify-between gap-3">
                        <Button
                            label={order?.cart_items?.length > 2 ? "View More" : "View Details"}
                            variant="outline-success"
                            onClick={() => navigate(`/orders/view-order/${order?.order_id}`)}
                        />
                        <Button
                            onClick={() => onStatusChange(order?._id, "ready_to_pickup")}
                            label="Ready For Pickup"
                            variant="soft-success"
                        />
                    </div>
                ) : activeTab === "ready" ? (
                    <div className="flex flex-col gap-3">
                        <Button
                            label={order?.cart_items?.length > 2 ? "View More" : "View Details"}
                            variant="outline-success"
                            onClick={() => navigate(`/orders/view-order/${order?.order_id}`)}
                        />
                        <Button
                            disabled
                            label="Order Is Ready. Waiting For Rider Pickup."
                            variant="soft-success"
                        />
                    </div>
                ) : null}

            </div>


        </div>
    );
};

export default OrderCard;