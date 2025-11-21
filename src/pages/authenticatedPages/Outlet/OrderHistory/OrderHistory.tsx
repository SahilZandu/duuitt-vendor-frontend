"use client";
import { useEffect, useState } from "react";
import type { TableColumn } from "react-data-table-component";
import { fetchOrdersByStatus, type Order } from "../../../../api/OrderApi";
import FormatDate from "../../../../components/Ui/FormatDate";
import MenuIcon from "../../../../lib/MenuIcon";
import { useNavigate } from "react-router-dom";
import Loader from "../../../../components/loader/Loader";
import PageTitle from "../../../../components/Ui/PageTitle";
import NoDataFound from "../../../../components/Ui/NoDataFound";
import DataTable from "react-data-table-component";

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
                    className={`px-2 py-1 rounded-full text-white text-sm capitalize ${row.status === "completed"
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
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <PageTitle title="Order History" />

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            id="statusFilter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="border border-gray-300 px-4 py-2.5 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                        >
                            <option value="all">All Orders</option>
                            <option value="completed">Completed</option>
                            <option value="declined">Declined</option>
                        </select>

                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="border border-gray-300 pl-10 pr-4 py-2.5 rounded-lg w-64 bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                            />
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="p-8">
                            <Loader />
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={orders}
                            progressPending={loading}
                            pagination
                            highlightOnHover
                            noDataComponent={<NoDataFound />}
                            paginationRowsPerPageOptions={[10, 25, 50]}
                            paginationPerPage={25}
                            paginationComponentOptions={{
                                rowsPerPageText: 'Rows per page:',
                                rangeSeparatorText: 'of',
                            }}
                            customStyles={{
                                table: {
                                    style: {
                                        borderRadius: '12px',
                                    },
                                },
                                rows: {
                                    style: {
                                        borderBottom: '1px solid #f3f4f6',
                                        fontSize: 14,
                                        '&:hover': {
                                            backgroundColor: '#faf5ff',
                                        },
                                    },
                                },
                                headRow: {
                                    style: {
                                        fontWeight: 600,
                                        fontSize: 14,
                                        color: '#fff',
                                        backgroundColor: '#9333ea',
                                        borderTopLeftRadius: '12px',
                                        borderTopRightRadius: '12px',
                                    },
                                },
                                headCells: {
                                    style: {
                                        paddingTop: '14px',
                                        paddingBottom: '14px',
                                    },
                                },
                                cells: {
                                    style: {
                                        paddingTop: '12px',
                                        paddingBottom: '12px',
                                    },
                                },
                                pagination: {
                                    style: {
                                        borderTop: '1px solid #f3f4f6',
                                        backgroundColor: '#fafafa',
                                    },
                                },
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;