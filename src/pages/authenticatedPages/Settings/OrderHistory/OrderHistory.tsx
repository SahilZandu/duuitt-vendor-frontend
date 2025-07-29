"use client";
import { useEffect, useState } from "react";
import type { TableColumn } from "react-data-table-component";
import { fetchOrdersByStatus, type Order } from "../../../../api/settingsApi";
import GlobalDataTable from "../../../../components/layout/GlobalDataTable";
import FormatDate from "../../../../components/Ui/FormatDate";
import MenuIcon from "../../../../lib/MenuIcon";
import { useNavigate } from "react-router-dom";
import Loader from "../../../../components/loader/Loader";
import PageTitle from "../../../../components/Ui/PageTitle";

const OrderHistory = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "declined">("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const restaurantId = localStorage.getItem("restaurant_id") || "";

    const getOrders = async () => {
        try {
            setLoading(true);
            const data = await fetchOrdersByStatus({
                restaurant_id: restaurantId,
                status: statusFilter,
                search,
                limit: 10000,
            });
            setOrders(data);

        } catch (err) {
            console.error("Failed to fetch orders:", err);
        } finally {
            setLoading(false);
        }
    };

    // Reset when filter or search changes
    useEffect(() => {
        getOrders();
    }, [statusFilter, search]);


    const columns: TableColumn<Order>[] = [
        {
            name: "Sr No",
            cell: (_row, index) => index + 1,
            width: "80px",
        },
        { name: "Order Id", selector: (row) => row?.order_id, sortable: true },
        { name: "Invoice No", selector: (row) => row?.invoice_no, sortable: true },
        { name: "Customer", selector: (row) => row?.customer?.name || "N/A", sortable: true },
        {
            name: "Date & Time",
            selector: (row) => row.createdAt,
            sortable: true,
            cell: (row) => <FormatDate isoDate={row.createdAt} />,
        },
        {
            name: "Payment",
            selector: (row) => row?.payment_method_id?.toUpperCase(),
            sortable: true,
        },
        {
            name: "Amount (₹)",
            selector: (row) => row?.total_amount.toFixed(2),
            sortable: true,
            right: true,
        },
        {
            name: "Status",
            cell: (row) => (
                <span
                    className={`px-3 py-1 rounded-full text-white text-sm capitalize ${row.status === "completed"
                        ? "bg-green-600"
                        : row.status === "declined"
                            ? "bg-red-500"
                            : row.status === "pending"
                                ? "bg-yellow-500"
                                : "bg-gray-400"
                        }`}
                >
                    {row.status}
                </span>
            ),
            sortable: true,
        },
        {
            name: "Action",
            cell: (row) => (
                <button
                    onClick={() => navigate(`/outlet/order-history/view/${row?.order_id}`)}
                    className={`px-2 py-1 rounded-md text-sm `}
                >
                    <MenuIcon name="view" />
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <div className="p-6">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                {/* <h1 className="text-2xl font-bold mb-4">Order History</h1> */}
                <PageTitle title="Order History"/>

                {/* Filters */}
                <div className="flex justify-between items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <select
                            id="statusFilter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="border px-3 py-2 rounded-md"
                        >
                            <option value="all">All Orders</option>
                            <option value="completed">Completed</option>
                            <option value="declined">Declined</option>
                        </select>
                    </div>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-3 py-2 rounded-md w-full max-w-xs"
                    />
                </div>
            </div>

            {/* Table */}
            <GlobalDataTable
                columns={columns}
                data={orders}
                pagination={true}
                selectableRows={false}
            />

            {loading && <Loader />}


        </div>
    );
};

export default OrderHistory;
