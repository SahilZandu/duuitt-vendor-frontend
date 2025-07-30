import React from "react";
import MenuIcon from "../../lib/MenuIcon";
import Button from "../Ui/Button";

interface DeleteModalProps {
    isOpen: boolean;
    title: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    actionLoading?: boolean;
    onDelete: () => void;
    onClose: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    isOpen,
    title,
    message = "Are you sure you want to delete this item? This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    actionLoading = false,
    onDelete,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-xl bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800"
                        aria-label="Close modal"
                    >
                        <MenuIcon name="close" />
                    </button>
                </div>

                {/* Message */}
                <div className="px-6 py-5 text-center text-sm text-gray-700">
                    {message}
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-4 border-t px-6 py-5">
                    <Button
                        onClick={onClose}
                        label={cancelText}
                        variant="outline"
                    />
                    <Button
                        onClick={onDelete}
                        disabled={actionLoading}
                        variant="danger"
                        label={actionLoading ? `${confirmText}...` : confirmText}
                    />
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
