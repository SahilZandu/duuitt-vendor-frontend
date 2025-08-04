import React, { useEffect, useState } from "react";
import MenuIcon from "../../lib/MenuIcon";
import Button from "../Ui/Button";
import Input from "../Ui/Input";

interface TimeSlotModalProps {
    isOpen: boolean;
    title?: string;
    actionLoading?: boolean;
    onSubmit: (data: { startTime: string; endTime: string }) => void;
    onClose: () => void;
    existingSlots?: { from: string; to: string }[]; // ← new prop

    defaultFrom?: string;
    defaultTo?: string;
    isEditing?: boolean;
    actionLabel?: string;
}


const TimeSlotModal: React.FC<TimeSlotModalProps> = ({
    isOpen,
    actionLabel = "Add New Time Slot",
    actionLoading = false,
    onSubmit,
    onClose,
    // existingSlots,
    defaultFrom,
    defaultTo
}) => {
    const [startTime, setStartTime] = useState(defaultFrom || "");
    const [endTime, setEndTime] = useState(defaultTo || "");
    useEffect(() => {
        setStartTime(defaultFrom || "");
        setEndTime(defaultTo || "");
    }, [defaultFrom]);

    useEffect(() => {
        setEndTime(defaultTo || "");
    }, [defaultTo]);

    const [errors, setErrors] = useState<{ from?: string; to?: string }>({});

    if (!isOpen) return null;

    const handleSubmit = () => {
        const newErrors: typeof errors = {};

        if (!startTime) newErrors.from = "Please select a start time.";
        if (!endTime) newErrors.to = "Please select an end time.";

        // if (startTime && endTime && startTime >= endTime) {
        //     newErrors.from = "'From' time must be earlier than 'To' time.";
        // }
      
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // All good – submit
        onSubmit({ startTime, endTime });
        setStartTime("");
        setEndTime("");
        setErrors({});
    };
    const handleClose = () => {
        setStartTime("");
        setEndTime("");
        setErrors({});
        onClose(); // Notify parent to close the modal
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
            onClick={handleClose}
        >
            <div
                className="w-full max-w-md rounded-xl bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-900">{actionLabel}</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-800"
                        aria-label="Close modal"
                    >
                        <MenuIcon name="close" />
                    </button>
                </div>

                {/* Form */}
                <div className="px-6 py-5 space-y-4">
                    <div>
                        <Input
                            type="time"
                            label="From"
                            value={startTime}
                            onChange={(e) => {
                                setStartTime(e.target.value);
                                if (errors.from) setErrors(prev => ({ ...prev, from: "" }));
                            }}
                        />
                        {errors.from && <p className="text-red-500 text-sm mt-1">{errors.from}</p>}
                    </div>
                    <div>
                        <Input
                            type="time"
                            label="To"
                            value={endTime}
                            onChange={(e) => {
                                setEndTime(e.target.value);
                                if (errors.to) setErrors(prev => ({ ...prev, to: "" }));
                            }}
                        />
                        {errors.to && <p className="text-red-500 text-sm mt-1">{errors.to}</p>}
                    </div>

                </div>

                {/* Actions */}
                <div className="flex justify-center gap-4 border-t px-6 py-5">
                    <Button onClick={onClose} label="Cancel" variant="outline" />
                    <Button
                        onClick={handleSubmit}
                        disabled={actionLoading}
                        label={actionLabel}
                    />
                </div>
            </div>
        </div>
    );
};

export default TimeSlotModal;
