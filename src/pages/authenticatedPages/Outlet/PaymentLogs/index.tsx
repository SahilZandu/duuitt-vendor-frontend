"use client";
import { useEffect, useState } from "react";
import type { TableColumn } from "react-data-table-component";
import GlobalDataTable from "../../../../components/layout/GlobalDataTable";
import Loader from "../../../../components/loader/Loader";
import PageTitle from "../../../../components/Ui/PageTitle";
import { fetchRestaurantPaymentLogs } from "../../../../api/RatingAndPaymentLogsApi";
import NoDataFound from "../../../../components/Ui/NoDataFound";

interface PaymentLog {
    _id: string;
    payment_type: "captured" | "refund" | "withdraw";
    amount: number;
    date: string;
    status: string;
    order_id?: string;
    payment_method?: string;
    customer_name?: string;
    transaction_number?: string;
    [key: string]: any;
}

const PaymentLogs = () => {
    const [orders, setOrders] = useState<PaymentLog[]>([]);
    console.log({ orders });

    const [statusFilter, setStatusFilter] = useState<"all" | "captured" | "refund" | "withdraw">("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const restaurantId = localStorage.getItem("restaurant_id") || "";

    const getOrders = async () => {
        try {
            setLoading(true);
            const response = await fetchRestaurantPaymentLogs({
                restaurant_id: restaurantId,
                status: statusFilter,
                search,
            });
            console.log({ response });

            // Flatten grouped data and add display_date
            const flattened = response?.map((group: any) => {
                return group.data.map((item: PaymentLog) => ({
                    ...item,
                    display_date: group.title,
                }));
            }).flat() || [];

            setOrders(flattened);
        } catch (err) {
            console.error("Failed to fetch payment logs:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrders();
    }, [statusFilter, search]);

    const columns: TableColumn<PaymentLog>[] = [
        {
            name: "Sr No",
            cell: (_row, index) => index + 1,
            width: "80px",
        },
        {
            name: "Date",
            selector: (row) => row.display_date,
            sortable: true,
        },
        {
            name: "Order ID",
            selector: (row) => row.order_id || "N/A",
            sortable: true,
        },
        {
            name: "Customer",
            selector: (row) => row?.name || "N/A",
            sortable: true,
        },
        {
            name: "Transaction No",
            selector: (row) => row.transaction_number || "N/A",
            sortable: true,
        },
        {
            name: "Amount (₹)",
            selector: (row) => row?.total_amount?.toFixed(2),
            sortable: true,
            right: true,
        },
        {
            name: "Type",
            selector: (row) => row.transaction_type,
            sortable: true,
        },
        {
            name: "Status",
            cell: (row) => {
                const status = row.status?.toLowerCase();

                const statusStyles: Record<string, string> = {
                    captured: "bg-green-600",
                    refund: "bg-orange-500",
                    withdraw: "bg-red-500",
                };

                if (!status || !statusStyles[status]) {
                    return <span className="text-gray-500 text-sm">N/A</span>;
                }

                return (
                    <span
                        className={`px-3 py-1 rounded-full text-white text-sm capitalize ${statusStyles[status]}`}
                    >
                        {status}
                    </span>
                );
            },
            sortable: true,
        },
        // {
        //     name: "Action",
        //     cell: (row) => (
        //         <button
        //             onClick={() => navigate(`/outlet/order-history/view/${row?.order_id}`)}
        //             className="px-2 py-1 rounded-md text-sm"
        //         >
        //             <MenuIcon name="view" />
        //         </button>
        //     ),
        //     ignoreRowClick: true,
        //     allowOverflow: true,
        //     button: true,
        // },
    ];

    return (
        <div className="p-6">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                <PageTitle title="Payment Logs" />

                {/* Filters */}
                <div className="flex justify-between items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <select
                            id="statusFilter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="border px-3 py-2 rounded-md"
                        >
                            <option value="all">All</option>
                            <option value="captured">Captured</option>
                            <option value="refund">Refund</option>
                            <option value="withdraw">Withdraw</option>
                        </select>
                    </div>

                    <input
                        type="text"
                        placeholder="Search ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-3 py-2 rounded-md w-full max-w-xs"
                    />
                </div>
            </div>

            {loading ? (
                <Loader />
            ) : orders && orders?.length === 0 ? (
                <NoDataFound message="No payment logs available." />
            ) : (
                <GlobalDataTable
                    columns={columns}
                    data={orders}
                    pagination={true}
                    selectableRows={false}
                />
            )}

        </div>
    );
};

export default PaymentLogs;
