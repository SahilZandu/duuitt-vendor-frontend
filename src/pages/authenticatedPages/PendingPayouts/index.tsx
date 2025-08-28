import { useState, useEffect } from "react";
import type { TableColumn } from "react-data-table-component";
import axiosInstance from "../../../api/apiInstance";
import DataTable from "react-data-table-component";
import PageTitle from "../../../components/Ui/PageTitle";
import NoDataFound from "../../../components/Ui/NoDataFound";
import Loader from "../../../components/loader/Loader";

interface Payout {
  _id?: string;
  payout_cycle?: string;
  total_week_order?: string;
  payout_date?: string;
  payout_amt?: number;
  status?: string;
}

const PendingPayouts = () => {
  const [offers, setOffers] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance(
        "post",
        "/food-order/vendor/get-restaurant-pending-payment-details",
        {
          restaurant_id: localStorage.getItem("restaurant_id"),
        }
      );
      setOffers(response?.data?.data || []);
    } catch (err) {
      console.error("Error fetching offers:", err);
      setError("Failed to fetch offers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const columns: TableColumn<Payout>[] = [
    {
      name: "Sr No",
      cell: (_row: Payout, index: number) => index + 1,
      width: "60px",
    },
    {
      name: "Payout Cycle",
      selector: (row: Payout) => row.payout_cycle || "N/A",
      sortable: true,
    },
    {
      name: "Orders",
      selector: (row: Payout) => row?.total_week_order || "N/A",
      sortable: true,
    },
    {
      name: "Payment Payable Date",
      selector: (row: Payout) => {
        if (!row?.payout_date) return "N/A";

        const date = new Date(row.payout_date);
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();

        return `${day} ${month} ${year} Till 9 PM`;
      },
      sortable: true,
    },
    {
      name: "Payable Amount",
      selector: (row: Payout) =>
        row?.payout_amt !== undefined && row?.payout_amt !== null
          ? row.payout_amt.toFixed(2)
          : "N/A",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: Payout) => row?.status || "N/A",
      sortable: true,
    },
  ];

  return (
    <div className="page p-4 md:p-6 lg:p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <PageTitle title="Past Cycles" />
      </div>

      {/* Highlighted Payout Info Section */}
      <div className="bg-red-100 border-l-4 border-red-600 p-4 rounded-md mb-6 text-red-800 text-sm md:text-base lg:text-lg shadow-sm">
        <p className="font-semibold">
          Payouts are credited to your account every Wednesday by 9 PM for all
          transactions from the previous Monday-Sunday.
        </p>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <Loader />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <DataTable
            columns={columns}
            data={offers}
            progressPending={loading}
            pagination
            noDataComponent={<NoDataFound message="No Offers Found" />}
            highlightOnHover
            paginationRowsPerPageOptions={[10, 25, 50]}
            paginationPerPage={25}
            paginationComponentOptions={{
              rowsPerPageText: "Rows per page:",
              rangeSeparatorText: "of",
            }}
            customStyles={{
              rows: {
                style: {
                  borderBottom: "1px solid #e5e7eb",
                  fontSize: 14,
                },
              },
              headRow: {
                style: {
                  fontWeight: 500,
                  fontSize: 16,
                  color: "#fff",
                  backgroundColor: "#a855f7",
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PendingPayouts;
