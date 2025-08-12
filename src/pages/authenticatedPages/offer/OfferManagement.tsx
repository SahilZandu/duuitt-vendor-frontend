import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import type { TableColumn } from 'react-data-table-component';
// import Icon from '@mdi/react';
// import { mdiPencil, mdiTrashCan } from '@mdi/js';
// import { toast } from 'react-toastify';
import axiosInstance from "../../../api/apiInstance";
import DataTable from 'react-data-table-component';
import PageTitle from '../../../components/Ui/PageTitle';
import { toast } from 'react-toastify';
import NoDataFound from '../../../components/Ui/NoDataFound';
import Loader from '../../../components/loader/Loader';

interface Offer {
    _id?: string;
    title?: string;
    referral_code?: string;
    discount_type?: string;
    discount_price?: number;
    usage_conditions?: {
        min_order_value?: number;
        first_order_of_day?: boolean;
        new_users_only?: boolean;
        time_window_end?: string;
        valid_from?: string;
        valid_until?: string;
    };
    createdAt?: string;
    is_vendor_accepted?: boolean | string;
}

// Replace this with your actual date formatting function
const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
};

const OfferManagement = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [statusFilter, setStatusFilter] = useState("all");
    const [searchText, setSearchText] = useState("");

    // Filter logic
    const filteredOffers = offers.filter((offer) => {
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && offer.is_vendor_accepted === true) ||
            (statusFilter === "inactive" && offer.is_vendor_accepted !== true);

        const matchesSearch =
            offer.title?.toLowerCase().includes(searchText.toLowerCase()) ||
            offer.referral_code?.toLowerCase().includes(searchText.toLowerCase());

        return matchesStatus && matchesSearch;
    });


    const fetchOffers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance("post", "/offers/all", {
                restaurant_id: localStorage.getItem("restaurant_id"),
            });
            setOffers(response?.data?.data || []);
        } catch (err) {
            console.error("Error fetching offers:", err);
            setError('Failed to fetch offers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    const handleToggleOfferStatus = async (offer: Offer) => {
        const updatedStatus = !(offer.is_vendor_accepted === true);

        try {
            const response = await axiosInstance("post", "/offers/vendor-offer-status", {
                offer_id: offer._id,
                is_vendor_accepted: updatedStatus,
            });
            console.log("response", response);

            toast.success(response?.data?.message || "")
            // Update the local state optimistically
            setOffers(prev =>
                prev.map(o => o._id === offer._id ? { ...o, is_vendor_accepted: updatedStatus } : o)
            );
        } catch (error) {
            console.error("Failed to update offer status", error);
            alert("Failed to update offer status. Please try again.");
        }
    };


    const columns: TableColumn<Offer>[] = [
        {
            name: 'Sr No',
            cell: (_row: Offer, index: number) => index + 1,
            width: '60px',
        },
        {
            name: 'Title',
            selector: (row: Offer) => row.title || 'N/A',
            sortable: true,
        },
        {
            name: 'Code',
            selector: (row: Offer) => row.referral_code || 'N/A',
            sortable: true,
        },
        {
            name: 'Discount Type',
            selector: (row: Offer) => row.discount_type || 'N/A',
            sortable: true,
        },
        {
            name: 'Discount',
            selector: (row: Offer) => row.discount_price ? `${row.discount_price}` : 'N/A',
            sortable: true,
        },
        {
            name: 'Min Order Value',
            selector: (row: Offer) => row.usage_conditions?.min_order_value?.toString() || 'N/A',
        },
        {
            name: 'First Order of Day',
            selector: (row: Offer) => row.usage_conditions?.first_order_of_day ? 'Yes' : 'No',
        },
        {
            name: 'New Users Only',
            selector: (row: Offer) => row.usage_conditions?.new_users_only ? 'Yes' : 'No',
            width: '140px',
        },
        {
            name: 'Valid From',
            selector: (row: Offer) => formatDate(row?.usage_conditions?.valid_from),
            sortable: true,
            width: '160px',
        },
        {
            name: 'Valid Till',
            selector: (row: Offer) => formatDate(row?.usage_conditions?.valid_until),
            width: '170px',
        },
        {
            name: 'Active/Inactive Offer',
            cell: (row: Offer) => (
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={row.is_vendor_accepted === true}
                        onChange={() => handleToggleOfferStatus(row)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 relative"></div>
                </label>
            ),
            width: '140px',
        }

    ];

    return (
        <div className="page">

            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                <PageTitle title="Offer List" />

                {/* Filters */}
                <div className="flex justify-between items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <select
                            id="statusFilter"
                            className="border px-3 py-2 rounded-md"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <input
                        type="text"
                        placeholder="Search by title or code..."
                        className="border px-3 py-2 rounded-md w-full max-w-xs"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {loading ? (
                <Loader />
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={filteredOffers}
                        progressPending={loading}
                        pagination
                        noDataComponent={<NoDataFound message="No Offers Found" />}
                        highlightOnHover
                        paginationRowsPerPageOptions={[10, 25, 50]}
                        paginationPerPage={25}
                        paginationComponentOptions={{
                            rowsPerPageText: 'Rows per page:',
                            rangeSeparatorText: 'of',
                        }}
                        customStyles={{
                            rows: {
                                style: {
                                    borderBottom: '1px solid #e5e7eb',
                                    fontSize: 14,
                                },
                            },
                            headRow: {
                                style: {
                                    fontWeight: 500,
                                    fontSize: 16,
                                    color: '#fff',
                                    backgroundColor: '#a855f7',
                                },
                            },
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default OfferManagement;
