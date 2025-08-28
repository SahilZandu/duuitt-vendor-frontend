import { useEffect, useState } from "react";
import apiRequest from "../../api/apiInstance";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Restaurant } from "../../api/ProfileUpdateApi";
import type {
  OrderLog,
  PaymentFilterBody,
  SettledPaymentRow,
} from "../../types/types";

// Create a type for the partial restaurant data that comes from the API
type PartialRestaurant = Pick<Restaurant, "name" | "address"> & {
  _id?: string;
};

const SettledPaymentList = () => {
  // const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const [showModal, setShowModal] = useState(false);
  // const [selectedOrderLog, setSelectedOrderLog] = useState([]);
  // const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const [rows, setRows] = useState<SettledPaymentRow[]>([]);
  const [selectedOrderLog, setSelectedOrderLog] = useState<OrderLog[]>([]);
  // Fix: Use PartialRestaurant type instead of full Restaurant type
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<PartialRestaurant | null>(null);

  const [logSearch, setLogSearch] = useState("");
  const [logPage, setLogPage] = useState(1);
  const logPerPage = 10;

  // Date filter states
  const [dateFilter, setDateFilter] = useState("all"); // day, week, month, year, custom, all
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const body: PaymentFilterBody = {
          date_filter: dateFilter,
          restaurant_id: localStorage.getItem("restaurant_id"),
        };

        if (dateFilter === "custom") {
          if (startDate) body.start_date = startDate;
          if (endDate) body.end_date = endDate;
        } else if (dateFilter !== "all") {
          // For day, week, month, year → send both start_date & end_date
          if (startDate) body.start_date = startDate;
          if (endDate) body.end_date = endDate;
        }

        const res = await apiRequest(
          "post",
          "/food-order/get-vendor-success-payment-list",
          body
        );
        console.log("Fetched settled payments:", res.data);
        setRows(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch settled payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateFilter, startDate, endDate]);

  // Filter main table
  const filteredRows = rows.filter(
    (row) =>
      row.restaurant_id?.name?.toLowerCase().includes(search.toLowerCase()) ||
      row.vendor_id?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination main table
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Open/close modal
  const openOrderLog = (row: SettledPaymentRow) => {
    setSelectedOrderLog(Array.isArray(row.order_log) ? row.order_log : []);
    // Fix: Cast to PartialRestaurant or use type assertion
    setSelectedRestaurant((row.restaurant_id as PartialRestaurant) || null);
    setShowModal(true);
    setLogSearch("");
    setLogPage(1);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrderLog([]);
    setSelectedRestaurant(null);
  };

  // Filter logs
  const filteredLogs = selectedOrderLog.filter(
    (log) =>
      log.order_id?.toString().includes(logSearch) ||
      log.invoice_id?.toString().includes(logSearch) ||
      log.payment_id?.toString().includes(logSearch)
  );
  const logTotalPages = Math.ceil(filteredLogs.length / logPerPage);
  const logStart = (logPage - 1) * logPerPage;
  const currentLogs = filteredLogs.slice(logStart, logStart + logPerPage);

  // ===== PDF Export =====
  const exportPDF = (row: SettledPaymentRow) => {
    const doc = new jsPDF("landscape");
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(20);
    doc.text("Duuitt Pvt Ltd", pageWidth / 2, 15, { align: "center" });
    doc.setFontSize(14);
    doc.text("Restaurant Payout Invoice", pageWidth / 2, 25, {
      align: "center",
    });

    let y = 40;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Restaurant Details", 14, y);
    doc.setFont("helvetica", "normal");
    y += 7;
    doc.text(`Restaurant: ${row.restaurant_id?.name || "-"}`, 14, y);
    y += 7;
    doc.text(`Address: ${row.restaurant_id?.address || "-"}`, 14, y);
    y += 7;
    doc.text(`Vendor: ${row.vendor_id?.name || "-"}`, 14, y);
    y += 7;
    doc.text(
      `Email: ${row.vendor_id?.email || "-"} | Phone: ${
        row.vendor_id?.phone || "-"
      }`,
      14,
      y
    );

    const tableColumn = [
      "Payout Cycle",
      "Orders",
      "Payout Date",
      "Amount",
      "Status",
    ];
    const tableRows = [
      [
        row.payout_cycle || "-",
        row.total_week_order || "-",
        row.payout_date ? new Date(row.payout_date).toLocaleDateString() : "-",
        `${row.payout_amt?.toFixed(2) || "0.00"}`,
        row.status || "-",
      ],
    ];

    const mainTable = autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: y + 10,
      theme: "grid",
      styles: { fontSize: 10, halign: "center" },
      headStyles: { fillColor: [34, 197, 94], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    // Add Order Logs if exists
    if (row.order_log && row.order_log.length > 0) {
      const orderTableColumns = [
        "Order ID",
        "Invoice ID",
        "Payment ID",
        "Order Amount",
        "Refund Amt",
        "Duuitt Commission",
        "Restaurant Amt",
        "Order Status",
        "Date",
      ];
      const orderTableRows = row.order_log.map((log) => [
        log.order_id || "-",
        log.invoice_id || "-",
        log.payment_id || "-",
        `${log.food_order_details?.total_amount?.toFixed(2) ?? "0.00"}`,
        `${log.food_order_details?.refund_amt?.toFixed(2) ?? "0.00"}`,
        `${log.food_order_details?.admin_pay_amt?.toFixed(2) ?? "0.00"}`,
        `${log.food_order_details?.org_pay_amt?.toFixed(2) ?? "0.00"}`,
        (
          (log.food_order_details?.refund_status &&
          log.food_order_details?.refund_status !== "null" &&
          log.food_order_details?.refund_status !== "no_refund" &&
          log.food_order_details?.refund_status !== "not_applicable"
            ? log.food_order_details?.refund_status
            : log.food_order_details?.status) || "-"
        )
          .toString()
          .toUpperCase(),
        new Date(log.order_date ?? "").toLocaleDateString(),
      ]);

      autoTable(doc, {
        head: [orderTableColumns],
        body: orderTableRows,
        startY: (mainTable as any)?.finalY + 10,
        theme: "grid",
        styles: { fontSize: 9, halign: "center" },
        headStyles: { fillColor: [34, 197, 94], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });
    }

    doc.setFontSize(9);
    doc.text(
      "Generated by Duuitt System | Confidential",
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );

    doc.save(`payout_invoice_${row.restaurant_id?.name || "restaurant"}.pdf`);
  };

  // Apply Filter button
  const handleFilterSubmit = async () => {
    setLoading(true);
    try {
      const body: PaymentFilterBody = {
        date_filter: dateFilter,
      };

      if (dateFilter === "custom") {
        if (startDate) body.start_date = startDate;
        if (endDate) body.end_date = endDate;
      } else if (dateFilter !== "all") {
        if (startDate) body.start_date = startDate;
        if (endDate) body.end_date = endDate;
      }

      const res = await apiRequest(
        "post",
        "/food-order/get-vendor-success-payment-list",
        body
      );
      setRows(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch settled payments:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 p-4 rounded bg-gray-50">
        <h2 className="text-2xl font-bold text-black">
          Restaurant Payouts (Settled Payments)
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <input
            type="text"
            placeholder="Search by restaurant or vendor..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-2 text-black focus:outline focus:ring-2 focus:ring-purple-400"
          />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border rounded px-3 py-2 text-black"
          >
            <option value="all">All</option>
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="custom">Custom</option>
          </select>
          {dateFilter === "custom" && (
            <>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded px-2 py-1"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded px-2 py-1"
              />
            </>
          )}

          {dateFilter && (
            <button
              onClick={handleFilterSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Apply Filter
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border border-purple-600 text-left">
              <thead className="bg-purple-500 text-white">
                <tr>
                  <th className="p-2 border border-purple-600 text-center">
                    #
                  </th>
                  <th className="p-2 border border-purple-600">Restaurant</th>
                  <th className="p-2 border border-purple-600">Vendor</th>
                  <th className="p-2 border border-purple-600">Payout Cycle</th>
                  <th className="p-2 border border-purple-600">Orders</th>
                  <th className="p-2 border border-purple-600">Payout Date</th>
                  <th className="p-2 border border-purple-600">Amount</th>
                  <th className="p-2 border border-purple-600">Status</th>
                  <th className="p-2 border border-purple-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.length > 0 ? (
                  currentRows.map((row, index) => (
                    <tr key={row._id} className="odd:bg-white even:bg-gray-50">
                      <td className="p-2 border border-purple-600 text-center">
                        {indexOfFirstRow + index + 1}
                      </td>
                      <td className="p-2 border border-purple-600">
                        {row.restaurant_id?.name}
                        <div className="text-sm text-gray-500">
                          {row.restaurant_id?.address}
                        </div>
                      </td>
                      <td className="p-2 border border-purple-600">
                        {row.vendor_id?.name}
                        <div className="text-sm text-gray-500">
                          {row.vendor_id?.email} <br /> {row.vendor_id?.phone}
                        </div>
                      </td>
                      <td className="p-2 border border-purple-600">
                        {row.payout_cycle}
                      </td>
                      <td className="p-2 border border-purple-600 text-center">
                        {row.total_week_order}
                      </td>
                      <td className="p-2 border border-purple-600">
                        {row.payout_date
                          ? new Date(row.payout_date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="p-2 border border-purple-600 font-semibold">
                        ₹{row.payout_amt?.toFixed(2)}
                      </td>
                      <td className="p-2 border border-purple-600">
                        <span className="px-2 py-1 text-sm rounded bg-purple-100 text-purple-700">
                          {row.status}
                        </span>
                      </td>
                      <td className="p-2 border border-purple-600 text-center">
                        <button
                          onClick={() => openOrderLog(row)}
                          className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 mr-2"
                        >
                          View Orders
                        </button>
                        <button
                          onClick={() => exportPDF(row)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="p-4 text-center text-gray-500 border border-purple-600"
                    >
                      No settled payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination for Main Table */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {/* ===== Modal for Orders ===== */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
                <h3 className="text-xl font-bold mb-4">
                  Orders for {selectedRestaurant?.name}
                </h3>

                <button
                  onClick={closeModal}
                  className="absolute top-3 right-3 text-gray-500 hover:text-black"
                >
                  ✕
                </button>

                {/* Search inside modal */}
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={logSearch}
                  onChange={(e) => {
                    setLogSearch(e.target.value);
                    setLogPage(1);
                  }}
                  className="mb-3 px-3 py-2 border rounded w-full"
                />

                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 border">#</th>
                        <th className="p-2 border">Order ID</th>
                        <th className="p-2 border">Invoice ID</th>
                        <th className="p-2 border">Payment ID</th>
                        <th className="p-2 border">Amount</th>
                        <th className="p-2 border">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentLogs.length > 0 ? (
                        currentLogs.map((log, i) => (
                          <tr key={i} className="text-center">
                            <td className="p-2 border">{logStart + i + 1}</td>
                            <td className="p-2 border">{log.order_id}</td>
                            <td className="p-2 border">{log.invoice_id}</td>
                            <td className="p-2 border">{log.payment_id}</td>
                            <td className="p-2 border">
                              ₹{log.food_order_details?.total_amount ?? "0.00"}
                            </td>
                            <td className="p-2 border">
                              {log.order_date
                                ? new Date(log.order_date).toLocaleDateString()
                                : "-"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-4 text-center text-gray-500"
                          >
                            No order logs found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination for logs */}
                {logTotalPages > 1 && (
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => setLogPage(logPage - 1)}
                      disabled={logPage === 1}
                      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <span>
                      Page {logPage} of {logTotalPages}
                    </span>
                    <button
                      onClick={() => setLogPage(logPage + 1)}
                      disabled={logPage === logTotalPages}
                      className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SettledPaymentList;
