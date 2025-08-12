import React, { useEffect, useState } from "react";
import Button from "../../../../components/Ui/Button";
import Input from "../../../../components/Ui/Input";
import PageTitle from "../../../../components/Ui/PageTitle";
import Dropdown from "../../../../components/Ui/Dropdown";
import CheckBox from "../../../../components/Ui/CheckBox";
import { validateFormData } from "../../../../utils/validateForm";
import { teamMemberSchema } from "../../../../validations/teamMemberSchema";
import { toast } from "react-toastify";
import axiosInstance from "../../../../api/apiInstance";
import { useNavigate } from "react-router-dom";
import Loader from "../../../../components/loader/Loader";

type FormDataType = {
    name: string;
    phone: string;
    email: string;
    role: string;
    permissions: string[];
};
type FormErrorsType = Partial<{
    name: string;
    phone: string;
    email: string;
    role: string;
    permissions: string | string[];
}>;

const allPermissions = [
    { id: 1, label: "All", value: "all" },
    { id: 2, label: "Menu Management", value: "menu_management" },
    { id: 3, label: "Menu Item in-stock / out of stock", value: "menu_item_stock" },
    { id: 4, label: "Store Online / Offline", value: "store_online_offline" },
    { id: 15, label: "Manage Team members", value: "manage_team" },
    { id: 6, label: "Payments", value: "payments" },
    { id: 7, label: "Orders Management (Accept / Decline)", value: "orders_accept_decline" },
    { id: 8, label: "Orders Management (Status update once accepted)", value: "orders_status_update" },
    { id: 9, label: "Order History", value: "order_history" },
    { id: 10, label: "Offers", value: "offers" },
    { id: 11, label: "Business Profile update", value: "business_profile" },
    { id: 12, label: "Settings (feedback, FSSAI document, bank details, time management etc.)", value: "settings" },
    { id: 13, label: "Product Management", value: "product_management" },
];

const rolePermissions: Record<string, string[]> = {
    manager: allPermissions.map((p) => p.value), // all checked
    accountant: ["payments"],
    cook: ["orders_accept_decline", "orders_status_update", "order_history"],
    custom: [],
};

const AddTeamMember = () => {
    const [formData, setFormData] = useState<FormDataType>({
        name: "",
        phone: "",
        email: "",
        role: "",
        permissions: [],
    });
    const [errors, setErrors] = useState<FormErrorsType>({
        name: "",
        phone: "",
        email: "",
        role: "",
        permissions: "",
    });

    console.log({ formData });
    const searchParams = new URLSearchParams(location.search);
    const isEdit = searchParams.get("edit"); // "true" or null
    const editId = searchParams.get("editId");
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    console.log({ selectedPermissions });
    const [loading, setLoading] = useState(false);
    const rolesOptions = [
        { id: 1, label: "Cook", value: "cook" },
        { id: 2, label: "Manager", value: "manager" },
        { id: 3, label: "Accountant", value: "accountant" },
        { id: 4, label: "Custom", value: "custom" },
    ];

    const handleRoleChange = (role: string) => {
        setFormData((prev) => ({ ...prev, role }));
        if (role !== "custom") {
            const rolePerms = rolePermissions[role] || [];
            setSelectedPermissions(rolePerms);
            setFormData((prev) => ({ ...prev, permissions: rolePerms }));
        } else {
            setFormData((prev) => ({ ...prev, permissions: selectedPermissions }));
        }

        setErrors((prev) => ({ ...prev, role: "" }));
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    console.log("errors", errors);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { valid, errors } = await validateFormData(teamMemberSchema, {
            ...formData,
            permissions: selectedPermissions,
        });

        if (!valid) {
            setErrors(errors);
            return;
        }

        setErrors({});
        const selectedRole = rolesOptions.find(role => role.value === formData.role);

        const payload = {
            ...formData,
            permissions: selectedPermissions.map((value) => {
                const permission = allPermissions.find((p) => p.value === value);
                return {
                    name: permission?.label || "",
                    active: 1,
                    id: permission?.id || "",
                };
            }),
            restaurant_id: localStorage.getItem("restaurant_id"),
            phone: Number(formData?.phone),
            roles: selectedRole
                ? { id: selectedRole.id, name: selectedRole.label, active: true }
                : null,
            is_active: true
        };
        setIsSubmitting(true);
        const apiUrl = isEdit ? `/vendor/update-team-member` : "/vendor/add-team-member"
        const finalPayload = isEdit
            ? { ...payload, team_member_id: editId }
            : payload;

        try {
            const response = await axiosInstance("post", apiUrl, finalPayload);
            console.log("response----------", response);
            navigate("/team")
            toast.success("Team member added successfully");
        } catch (err) {
            console.error("Error submitting team member", err);
            toast.error("Operation failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" })); // Clear individual error
    };
    const ALL_VALUES = allPermissions.map(p => p.value);
    const INDIVIDUAL_VALUES = ALL_VALUES.filter(v => v !== "all");

    const handlePermissionsChange = (updated: string[]) => {
        if (updated.length > 0) {
            setErrors(prev => ({ ...prev, permissions: "" }));
        }

        setSelectedPermissions(prev => {
            // compute what changed
            const added = updated.filter(v => !prev.includes(v));
            const removed = prev.filter(v => !updated.includes(v));

            // 1) user clicked to add "all"
            if (added.includes("all")) {
                return ALL_VALUES.slice(); // select all
            }

            // 2) user clicked to remove "all"
            if (removed.includes("all")) {
                return []; // unselect all
            }

            // 3) individual changes
            // if all individual permissions are now selected -> select all (including "all")
            const updatedSet = new Set(updated);
            const allIndividualsSelected = INDIVIDUAL_VALUES.every(v => updatedSet.has(v));
            if (allIndividualsSelected) {
                return ALL_VALUES.slice();
            }

            // otherwise ensure "all" is not present
            return updated.filter(v => v !== "all");
        });
        setFormData(prev => ({ ...prev, permissions: updated }));

    };
    const navigate = useNavigate();
    const fetchSingleTeamMember = async () => {
        setLoading(true);
        const payload = {
            team_member_id: editId,
            restaurant_id: localStorage.getItem("restaurant_id"),
        };
        try {
            const response = await axiosInstance("post", "/vendor/get-team-member", payload);
            const fetchedData = response?.data?.data;
            console.log("fetchedData------------", fetchedData);

            const roleFromApi = fetchedData?.roles?.name.toLowerCase() || "";

            const activePermissions = fetchedData?.permissions
                ?.filter((p: any) => p.name)
                .map((p: any) => {
                    const matched = allPermissions.find(
                        (perm) =>
                            perm.label.toLowerCase() === p.name.toLowerCase() ||
                            p.name.toLowerCase().includes(perm.label.toLowerCase())
                    );
                    return matched?.value;
                })
                .filter(Boolean) as string[];
            console.log("activePermissions--------------", activePermissions);

            setFormData({
                name: fetchedData?.name || "",
                email: fetchedData?.email || "",
                phone: fetchedData?.phone?.toString() || "",
                role: roleFromApi,
                permissions: activePermissions,
            });
            setSelectedPermissions(activePermissions);

        } catch (err) {
            console.error("Error fetching team member", err);
        } finally {
            setLoading(false);
        }
    };
    // get single team member details
    useEffect(() => {
        if (isEdit) {
            fetchSingleTeamMember();
        };
    }, [isEdit])

    if (loading) {
        return (
            <Loader />
        )
    }
    return (
        <>
            <form onSubmit={handleSubmit} className="px-4 py-6 md:px-8 bg-white">
                <button
                    onClick={() => navigate('/team')}
                    className="cursor-pointer mb-2 inline-flex items-center text-base px-3 py-1 bg-gray-200 rounded-lg"
                >
                    <span className="icon mr-2 text-lg">←</span>
                    Back
                </button>
                <PageTitle title="Add Team Member" align="left" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        type="text"
                        name="name"
                        label="Name"
                        value={formData.name}
                        // onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        required
                        error={errors?.name}
                    />
                    <Input
                        type="number"
                        name="phone"
                        label="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        required
                        error={errors?.phone}
                    />
                    <Input
                        name="email"
                        label="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        required
                        error={errors?.email}
                    />
                    <Dropdown
                        label="Select Role"
                        options={rolesOptions}
                        placeholder="Select role"
                        value={formData?.role}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        // required
                        error={errors?.role}
                    />
                </div>
                <div className="grid grid-cols-1 ga-2">
                    {formData?.role && (
                        <CheckBox
                            label="Assign Permissions"
                            name="permissions"
                            options={allPermissions}
                            selected={selectedPermissions}
                            onChange={handlePermissionsChange}
                            className="grid grid-cols-1 ga-2"
                            error={typeof errors?.permissions === 'string'
                                ? errors.permissions
                                : Array.isArray(errors?.permissions)
                                    ? errors.permissions.join(', ')
                                    : undefined}
                        />

                    )}
                </div>
                <div className="mt-6 flex justify-end">
                    <Button
                        type="submit"
                        variant="primary"
                        loading={isSubmitting}
                        label="Submit"
                        className="text-sm !w-auto px-4 py-2"
                    />
                </div>
            </form>
        </>
    );
};

export default AddTeamMember;
