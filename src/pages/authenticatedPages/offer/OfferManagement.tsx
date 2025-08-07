import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import type { TableColumn } from 'react-data-table-component';
// import Icon from '@mdi/react';
// import { mdiPencil, mdiTrashCan } from '@mdi/js';
// import { toast } from 'react-toastify';
import axiosInstance from "../../../api/apiInstance";
import DataTable from 'react-data-table-component';
import PageTitle from '../../../components/Ui/PageTitle';

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
    };
    createdAt?: string;
    status?: boolean | string;
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

    // const navigate = useNavigate();

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

    // const handleEdit = (offer: Offer) => {
    //     if (offer._id) {
    //         navigate(`/offers/edit/${offer._id}`);
    //     }
    // };

    // const handleDelete = async (offer: Offer) => {
    //     if (!offer._id) return;
    //     try {
    //         await axiosInstance("delete", `/offers/delete/${offer._id}`);
    //         toast.success('Offer deleted successfully');
    //         fetchOffers();
    //     } catch (err) {
    //         console.error('Delete error:', err);
    //         toast.error('Failed to delete offer');
    //     }
    // };

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
            name: 'Expiry Date',
            selector: (row: Offer) =>
                row.usage_conditions?.time_window_end
                    ? formatDate(row.usage_conditions.time_window_end)
                    : 'N/A',
            width: '170px',
        },
        {
            name: 'Created',
            selector: (row: Offer) => formatDate(row.createdAt),
            sortable: true,
            width: '160px',
        },
        {
            name: 'Status',
            cell: (row: Offer) => (
                <span
                    className={`px-2 py-1 rounded text-white text-xs ${row.status === true || row.status === 'true'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                >
                    {row.status === true || row.status === 'true' ? 'Active' : 'Inactive'}
                </span>
            ),
            sortable: true,
            width: '100px',
        },
        // {
        //     name: 'Actions',
        //     cell: (row: Offer) => (
        //         <div className="flex gap-2">
        //             <div
        //                 onClick={() => handleEdit(row)}
        //                 className="cursor-pointer p-1"
        //                 title="Edit Coupon"
        //             >
        //                 <Icon path={mdiPencil} size={0.8} color="green" />
        //             </div>
        //             <div
        //                 onClick={() => handleDelete(row)}
        //                 className="cursor-pointer p-1"
        //                 title="Delete Coupon"
        //             >
        //                 <Icon path={mdiTrashCan} size={0.8} color="red" />
        //             </div>
        //         </div>
        //     ),
        //     width: '150px',
        // },
    ];

    return (
        <div className="page">
            <PageTitle title="Offer List"/>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <DataTable
                    columns={columns}
                    data={offers}
                    progressPending={loading}
                    pagination
                    highlightOnHover
                    noDataComponent={<div className="py-4 text-gray-600">No offers found</div>}
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
        </div>
    );
};

export default OfferManagement;
