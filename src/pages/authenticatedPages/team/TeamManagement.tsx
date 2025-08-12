import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axiosInstance from "../../../api/apiInstance";
import AddTeamMemberModal from "../../../components/modals/AddTeamMemberModal";
import PageTitle from "../../../components/Ui/PageTitle";
import Button from "../../../components/Ui/Button";
import MenuIcon from "../../../lib/MenuIcon";
import DeleteModal from "../../../components/modals/DeleteModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/loader/Loader";

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
    const [editMember, setEditMember] = useState<TeamMember | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
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
    const [currentMemberId, setCurrentMemberId] = useState("");
    const handleDeleteTeamMember = (row: any) => {
        console.log("row-------------", row);
        setCurrentMemberId(row?._id);
        setShowDeleteModal(true);
    }
    const handleToggleTeamStatus = async (team: TeamMember) => {
        const updatedStatus = !(team.is_active);

        try {
            const response = await axiosInstance("post", "/vendor/active-inactive-team-member", {
                team_member_id: team?._id,
                is_active: updatedStatus,
            });
            console.log("response", response);

            toast.success(response?.data?.message || "")
            // Update the local state optimistically
            setTeam(prev =>
                prev.map(o => o._id === team._id ? { ...o, is_active: updatedStatus } : o)
            );
        } catch (error) {
            console.error("Failed to update offer status", error);
            alert("Failed to update offer status. Please try again.");
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
            name: 'Status',
            cell: (row: TeamMember) => (
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={row.is_active}
                        onChange={() => handleToggleTeamStatus(row)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 relative"></div>
                </label>
            ),
            width: '140px',
        },
        {
            name: "Actions",
            cell: (row: TeamMember) => (
                <div className="space-x-2">
                    {/* <button className="text-blue-600 hover:underline" onClick={() => {
                        setEditMember(row); // row from DataTable
                        setShowModal(true);
                    }}>Edit</button> */}
                    <button
                        onClick={() => navigate(`/team/add-team-member?edit="true"&&editId=${row?._id}`)}
                        className={`px-2 py-1 rounded-md text-sm border border-red-500`}
                    >
                        <MenuIcon name="edit" className="text-red-300" />
                    </button>
                    <button
                        className={`px-2 py-1 rounded-md text-sm bg-gray-200 `}
                        onClick={() => handleDeleteTeamMember(row)}
                    >
                        <MenuIcon name="delete" />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }

    ];
    const confirmDelete = async () => {
        setDeleting(true);

        try {
            const response = await axiosInstance("post", "/vendor/delete-team-member", {
                restaurant_id: localStorage.getItem("restaurant_id"),
                team_member_id: currentMemberId,
            });

            if (response?.data) {
                toast.success("Item deleted successfully.");
                await fetchTeam();
            } else {
                toast.error("Unexpected response from server.");
            }
        } catch (error) {
            toast.error("Failed to delete item.");
            console.error("Delete Error:", error);
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };
    const navigate = useNavigate();
    if (loading) {
        return (
            <Loader />
        )
    }
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <PageTitle title="Team Management" />
                <Button
                    onClick={() => navigate('/team/add-team-member')}
                    label="Add Team Member"
                    iconLeft={<MenuIcon name="add" />}
                    variant="primary"
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                />

            </div>
            <DataTable
                columns={columns}
                data={team}
                // progressPending={loading}
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
                onClose={() => {
                    setShowModal(false);
                    setEditMember(null);
                }}
                onSuccess={fetchTeam}
                teamMember={editMember}
            />
            <DeleteModal
                isOpen={showDeleteModal}
                actionLoading={deleting}
                title="Delete Restaurant Image"
                onClose={() => {
                    setShowDeleteModal(false);
                }}
                onDelete={confirmDelete}
            />

        </div>
    );
};

export default TeamManagement;
