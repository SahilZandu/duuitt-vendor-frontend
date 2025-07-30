import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axiosInstance from "../../../api/apiInstance";
import AddTeamMemberModal from "../../../components/modals/AddTeamMemberModal";

interface TeamMember {
    _id: string;
    name: string;
    email: string;
    phone: number;
    role: string;
    roles: {
        id: number;
        name: string;
        active: boolean;
    };
    permissions: {
        id: number;
        name: string;
        active: boolean;
    }[];
    is_active: boolean;
    createdAt: string;
}

const TeamManagement: React.FC = () => {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance("post", "/vendor/all-team-member", {
                restaurant_id: localStorage.getItem("restaurant_id"),
            });
            setTeam(response.data?.data || []);
        } catch (error) {
            console.error("Error fetching team members:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            name: "Name",
            selector: (row: TeamMember) => row.name,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row: TeamMember) => row.email,
            sortable: true,
        },
        {
            name: "Phone",
            selector: (row: TeamMember) => row.phone.toString(),
        },
        {
            name: "Role",
            selector: (row: TeamMember) => row.roles?.name || "—",
        },
        {
            name: "Status",
            selector: (row: TeamMember) => (row.is_active ? "Active" : "Inactive"),
        },
        {
            name: "Actions",
            cell: (_row: TeamMember) => (
              <div className="space-x-2">
                <button className="text-blue-600 hover:underline">Edit</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
          }
          
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Team Management</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                    + Add Team Member
                </button>
            </div>
            <DataTable
                    columns={columns}
                    data={team}
                    progressPending={loading}
                    pagination
                    highlightOnHover
                    noDataComponent={<div className="py-4 text-gray-600">No team member found</div>}
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

            <AddTeamMemberModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={fetchTeam} // refresh table after adding
            />
        </div>
    );
};

export default TeamManagement;
