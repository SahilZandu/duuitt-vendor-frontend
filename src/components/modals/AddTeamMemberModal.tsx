import React, { useEffect, useState } from "react";
import Modal from "../layout/Modal";
import axiosInstance from "../../api/apiInstance";
import { toast } from "react-toastify";

interface Permission {
  id: number;
  name: string;
  active: boolean;
}

interface Role {
  id: number;
  name: string;
  active: boolean;
}

interface TeamMember {
  _id: string;
  name: string;
  phone: number;
  email: string;
  roles: Role;
  permissions: Permission[];
  is_active: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teamMember?: TeamMember | null;
}

const defaultPermissions: Permission[] = [
  { id: 1, name: "Menu Management", active: false },
  { id: 2, name: "Menu Item in-stock / out of stock", active: false },
  { id: 3, name: "Store Online / Offline", active: false },
  { id: 4, name: "Manage Team members", active: false },
  { id: 5, name: "Payments", active: false },
  { id: 6, name: "Orders Management (Accept / Decline)", active: false },
  { id: 7, name: "Orders Management (Status update once accepted)", active: false },
  { id: 8, name: "Order History", active: false },
  { id: 9, name: "Offers", active: false },
  { id: 10, name: "Business Profile update", active: false },
  { id: 11, name: "Settings (feedback, FSSAI document, bank details, time management etc.)", active: false },
  { id: 12, name: "Product Management", active: false },
];

const roles: Role[] = [
  { id: 1, name: "cook", active: true },
  { id: 2, name: "manager", active: true },
  { id: 3, name: "accountant", active: true },
  { id: 4, name: "customer", active: true },
];

const AddTeamMemberModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, teamMember }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    role: null as Role | null,
    permissions: defaultPermissions,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (teamMember) {
      const updatedPermissions = defaultPermissions.map(p => {
        const match = teamMember.permissions.find(tp => tp.id === p.id);
        return { ...p, active: match?.active || false };
      });

      setForm({
        name: teamMember.name,
        phone: String(teamMember.phone),
        email: teamMember.email,
        role: roles.find(r => r.id === teamMember.roles.id) || null,
        permissions: updatedPermissions,
      });
    } else {
      setForm({
        name: "",
        phone: "",
        email: "",
        role: null,
        permissions: defaultPermissions,
      });
    }
    setErrors({});
  }, [teamMember, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone)) newErrors.phone = "Phone must be 10 digits";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.role) newErrors.role = "Role is required";
    if (!form.permissions.some(p => p.active)) newErrors.permissions = "Select at least one permission";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePermissionToggle = (id: number) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.map(p =>
        p.id === id ? { ...p, active: !p.active } : p
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const payload = {
      name: form.name,
      email: form.email,
      phone: Number(form.phone),
      restaurant_id: localStorage.getItem("restaurant_id"),
      roles: {
        id: form.role?.id,
        name: form.role?.name,
        active: true,
      },
      is_active: teamMember ? teamMember.is_active : false,
      permissions: form.permissions
        .filter(p => p.active)
        .map(p => ({
          id: p.id,
          name: p.name,
          active: true,
        })),
    };

    try {
      if (teamMember) {
        // EDIT
        await axiosInstance("put", `/vendor/update-team-member/${teamMember._id}`, payload);
        toast.success("Team member updated successfully");
      } else {
        // ADD
        await axiosInstance("post", "/vendor/add-team-member", payload);
        toast.success("Team member added successfully");
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error submitting team member", err);
      toast.error("Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal title={`${teamMember ? "Edit" : "Add"} Team Member`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Enter full name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            placeholder="Enter email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Role */}
        <div>
          <label className="block font-medium mb-1">Role</label>
          <select
            className="w-full border p-2 rounded"
            value={form.role?.id || ""}
            onChange={e => {
              const selectedRole = roles.find(r => r.id === parseInt(e.target.value));
              setForm({ ...form, role: selectedRole || null });
            }}
          >
            <option value="">Select role</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
        </div>

        {/* Permissions */}
        <div>
          <label className="block font-medium mb-1">Permissions</label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded">
            {form.permissions.map(p => (
              <label key={p.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={p.active}
                  onChange={() => handlePermissionToggle(p.id)}
                />
                <span>{p.name}</span>
              </label>
            ))}
          </div>
          {errors.permissions && (
            <p className="text-red-500 text-sm">{errors.permissions}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${
              isSubmitting ? "bg-purple-300 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
            } text-white px-4 py-2 rounded`}
          >
            {isSubmitting ? "Saving..." : teamMember ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTeamMemberModal;
