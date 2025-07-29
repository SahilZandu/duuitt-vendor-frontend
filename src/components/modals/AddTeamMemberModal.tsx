import React, { useState } from "react";
import Modal from "../layout/Modal";
import axiosInstance from "../../api/apiInstance"; // <-- Make sure path is correct

interface Permission {
  id: number;
  name: string;
  active: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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

const AddTeamMemberModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    role: "",
    permissions: defaultPermissions,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone)) newErrors.phone = "Phone must be 10 digits";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.role.trim()) newErrors.role = "Role is required";
    const selected = form.permissions.filter(p => p.active);
    if (selected.length === 0) newErrors.permissions = "Select at least one permission";
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

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      restaurant_id: localStorage.getItem("restaurant_id"),
      permissions: form.permissions.filter(p => p.active).map(p => ({
        id: p.id,
        name: p.name,
        active: true,
      })),
    };

    try {
      await axiosInstance("post", "/vendor/create-team-member", payload);
      onSuccess(); // refresh team list
      onClose(); // close modal
      setForm({
        name: "",
        phone: "",
        email: "",
        role: "",
        permissions: defaultPermissions,
      });
      setErrors({});
    } catch (err) {
      console.error("Failed to add team member", err);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal title="Add Team Member" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Name</label>
          <input
            type="text"
            className="input"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label>Phone</label>
          <input
            type="text"
            className="input"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            className="input"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div>
          <label>Role</label>
          <select
            className="input"
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            <option value="">Select role</option>
            <option value="manager">Manager</option>
            <option value="accountant">Accountant</option>
            <option value="cook">Cook</option>
            <option value="customer">Customer</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
        </div>

        <div>
          <label className="block mb-1">Permissions</label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
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

        <div className="flex justify-end space-x-2 mt-4">
          <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTeamMemberModal;
