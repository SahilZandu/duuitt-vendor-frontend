import { useEffect, useState } from "react";
import Tabs from "../../../components/Ui/Tabs";
import Button from "../../../components/Ui/Button";
import TimeSlotModal from "../../../components/modals/TimeSlotModal";
import DeleteModal from "../../../components/modals/DeleteModal";
import { addRestaurantTimings, deleteRestaurantTiming, updateRestaurantTiming } from "../../../api/timingsApi";
import { useVendor } from "../../../lib/Context/VendorContext";
import { toast } from "react-toastify";
import type {
    RestaurantTiming,
    Slot,
    EditingSlot,
    RestaurantTimingPayload,
} from '../../../types/types';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Timings: React.FC = () => {
    const { vendor } = useVendor();
    const timing = vendor?.restaurant?.timings as RestaurantTiming | undefined;

    const [activeTab, setActiveTab] = useState<'all' | 'specific'>('all');
    const [allDaySlots, setAllDaySlots] = useState<Slot[]>([]);
    const [specificDaySlots, setSpecificDaySlots] = useState<Record<string, Slot[]>>(() =>
        daysOfWeek.reduce((acc, d) => {
            acc[d] = [];
            return acc;
        }, {} as Record<string, Slot[]>)
    );

    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [editingSlot, setEditingSlot] = useState<EditingSlot | null>(null);
    const [isTimeSlotOpen, setIsTimeSlotOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingSlot, setDeletingSlot] = useState<{
        type: 'all' | 'specific';
        slotId: number;
        dayOfWeek?: number;
        index?: number;
    } | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const vendor_id = localStorage.getItem('vendor_id');
    const restaurant_id = localStorage.getItem('restaurant_id');

    const formatTime = (time24: string) => {
        const [h, m] = time24.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hr12 = h % 12 || 12;
        return `${hr12}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    useEffect(() => {
        if (!timing) {
            setAllDaySlots([]);
            setSpecificDaySlots(
                daysOfWeek.reduce((acc, d) => {
                    acc[d] = [];
                    return acc;
                }, {} as Record<string, Slot[]>)
            );
            return;
        }

        if (timing.is_all_day && timing.all_days.timings.length > 0) {
            const slots: Slot[] = timing.all_days.timings.map((item) => ({
                id: Date.now() + Math.random(),
                from: item.open_times,
                to: item.close_time,
                is_edit_delete: item.is_edit_delete,
                timing_id: item._id,
            }));
            setAllDaySlots(slots);
        } else {
            const specific: Record<string, Slot[]> = {};
            timing.specified.forEach((dayTiming, i) => {
                specific[daysOfWeek[i]] = dayTiming.timings.map((slot) => ({
                    id: Date.now() + Math.random(),
                    from: slot.open_times,
                    to: slot.close_time,
                    is_edit_delete: slot.is_edit_delete,
                    timing_id: slot._id,
                }));
            });
            setSpecificDaySlots(specific);
        }
    }, [timing]);

    const deleteSlot = async () => {
        if (!deletingSlot || !restaurant_id) return;

        const { type, slotId, dayOfWeek, index } = deletingSlot;

        if (type === 'all') {
            const slot = allDaySlots.find((s) => s.id === slotId);
            if (slot?.isNew) {
                setAllDaySlots((prev) => prev.filter((s) => s.id !== slotId));
                closeDelete();
                return;
            }
            try {
                setDeleteLoading(true);
                await deleteRestaurantTiming({
                    restaurant_id,
                    day_of_week: 0,
                    index: index!,
                    is_all_day: true,
                });
                toast.success('Slot deleted.');
                setAllDaySlots((prev) => prev.filter((_, i) => i !== index));
                closeDelete();
            } catch {
                toast.error('Delete failed.');
                setDeleteLoading(false);
            }
        } else {
            const dow = dayOfWeek!;
            const dayName = daysOfWeek[dow];
            const slot = specificDaySlots[dayName].find((s) => s.id === slotId);
            if (slot?.isNew) {
                setSpecificDaySlots((prev) => ({
                    ...prev,
                    [dayName]: prev[dayName].filter((s) => s.id !== slotId),
                }));
                closeDelete();
                return;
            }
            try {
                setDeleteLoading(true);
                await deleteRestaurantTiming({
                    restaurant_id,
                    day_of_week: dow,
                    index: index!,
                    is_all_day: false,
                });
                toast.success('Slot deleted.');
                setSpecificDaySlots((prev) => {
                    const arr = [...prev[dayName]];
                    arr.splice(index!, 1);
                    return { ...prev, [dayName]: arr };
                });
                closeDelete();
            } catch {
                toast.error('Delete failed.');
                setDeleteLoading(false);
            }
        }
    };

    const closeDelete = () => {
        setIsDeleteModalOpen(false);
        setDeletingSlot(null);
        setDeleteLoading(false);
    };

    const handleSaveAllDaysTimings = async () => {
        if (!vendor_id || !restaurant_id) {
            toast.error('Missing vendor or restaurant ID');
            return;
        }
        try {
            const payload: RestaurantTimingPayload = {
                vendor_id,
                restaurant_id,
                timings: {
                    is_all_day: true,
                    all_days: {
                        outlet_status: false,
                        timings: allDaySlots.map((slot) => ({
                            open_times: slot.from,
                            close_time: slot.to,
                            days_of_week: 0,
                            is_edit_delete: slot.is_edit_delete,
                        })),
                    },
                    specified: Array(7).fill({ outlet_status: false, timings: [] }),
                },
            };
            await addRestaurantTimings(payload);
            setAllDaySlots((prev) => prev.map((s) => ({ ...s, isNew: false })));
            toast.success('All-day timings saved.');
        } catch {
            toast.error('Save failed.');
        }
    };

    const handleSaveSpecificDayTimings = async () => {
        if (!vendor_id || !restaurant_id) {
            toast.error('Missing vendor or restaurant ID');
            return;
        }
        try {
            const specified = daysOfWeek.map((day, i) => ({
                outlet_status: false,
                timings: specificDaySlots[day].map((slot) => ({
                    open_times: slot.from,
                    close_time: slot.to,
                    days_of_week: i,
                    is_edit_delete: slot.is_edit_delete,
                })),
            }));
            const payload: RestaurantTimingPayload = {
                vendor_id,
                restaurant_id,
                timings: {
                    is_all_day: false,
                    all_days: { outlet_status: false, timings: [] },
                    specified,
                },
            };
            await addRestaurantTimings(payload);
            setSpecificDaySlots((prev) => {
                const copy: Record<string, Slot[]> = {};
                daysOfWeek.forEach((day) => {
                    copy[day] = prev[day].map((s) => ({ ...s, isNew: false }));
                });
                return copy;
            });
            toast.success('Specific timings saved.');
        } catch {
            toast.error('Save failed.');
        }
    };

    const onSubmitSlot = async ({ startTime, endTime }: { startTime: string; endTime: string }) => {
        if (editingSlot) {
            const { slotIndex, slotData } = editingSlot;
            if (!slotData.timing_id) {
                toast.error('Missing timing ID');
                return;
            }
            try {
                await updateRestaurantTiming({
                    restaurant_id: restaurant_id!,
                    timing_id: slotData.timing_id,
                    open_times: startTime,
                    close_time: endTime,
                });
                toast.success('Slot updated.');
                if (activeTab === 'all') {
                    setAllDaySlots((prev) => {
                        const arr = [...prev];
                        arr[slotIndex] = { ...arr[slotIndex], from: startTime, to: endTime };
                        return arr;
                    });
                } else if (selectedDay) {
                    setSpecificDaySlots((prev) => {
                        const arr = [...prev[selectedDay]];
                        arr[slotIndex] = { ...arr[slotIndex], from: startTime, to: endTime };
                        return { ...prev, [selectedDay]: arr };
                    });
                }
            } catch {
                toast.error('Update failed.');
            }
            setEditingSlot(null);
            setIsTimeSlotOpen(false);
            return;
        }

        const newSlot: Slot = {
            id: Date.now(),
            from: startTime,
            to: endTime,
            is_edit_delete: true,
            isNew: true,
        };

        if (activeTab === 'all') {
            setAllDaySlots((prev) => [...prev, newSlot]);
        } else if (selectedDay) {
            setSpecificDaySlots((prev) => ({
                ...prev,
                [selectedDay]: [...prev[selectedDay], newSlot],
            }));
        }

        setIsTimeSlotOpen(false);
    };

    const tabOptions = [
        { label: 'All Days', value: 'all', icon: 'allDays' },
        { label: 'Specific Days', value: 'specific', icon: 'specificDays' },
    ];

    return (
        <div className="bg-white min-h-screen">
            <Tabs tabs={tabOptions} activeTab={activeTab}
                onTabChange={(tab: string) => {
                    // Make sure the value is valid before setting
                    if (tab === 'all' || tab === 'specific') {
                        setActiveTab(tab);
                    } else {
                        console.warn('Unexpected tab value', tab);
                    }
                }}
            />

            {activeTab === 'all' && (
                <div className="p-4 space-y-3">
                    <div className="flex justify-between">
                        <h3 className="text-lg font-semibold">All Days</h3>
                        {allDaySlots.length < 2 && (
                            <Button onClick={() => setIsTimeSlotOpen(true)} variant="primary" label="Add Timing" />
                        )}
                    </div>

                    {allDaySlots.map((slot, index) => (
                        <div key={slot.id} className="flex justify-between items-center">
                            <div className="flex gap-3 items-center">
                                <strong>Slot {index + 1}:</strong>
                                <span>{formatTime(slot.from)} to {formatTime(slot.to)}</span>
                            </div>
                            {slot.is_edit_delete && (
                                <div className="flex gap-2">
                                    {!slot.isNew && (
                                        <Button
                                            variant="outline-success"
                                            label="Edit"
                                            onClick={() => {
                                                setEditingSlot({ slotIndex: index, slotData: slot });
                                                setIsTimeSlotOpen(true);
                                            }}
                                        />
                                    )}
                                    <Button
                                        variant="danger"
                                        label="Delete"
                                        onClick={() => {
                                            setDeletingSlot({ type: 'all', slotId: slot.id, index });
                                            setIsDeleteModalOpen(true);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="flex justify-end">
                        <Button onClick={handleSaveAllDaysTimings} variant="primary" label="Save All Day Timings" />
                    </div>
                </div>
            )}

            {activeTab === 'specific' && (
                <div className="p-4 space-y-4">
                    {daysOfWeek.map((day, i) => (
                        <div key={day} className="border-b pb-2">
                            <div className="flex justify-between">
                                <h3 className="font-semibold">{day}</h3>
                                {specificDaySlots[day].length < 2 && (
                                    <Button
                                        label="Add Timing"
                                        variant="primary"
                                        onClick={() => {
                                            setSelectedDay(day);
                                            setIsTimeSlotOpen(true);
                                        }}
                                    />
                                )}
                            </div>

                            {specificDaySlots[day].map((slot, index) => (
                                <div key={slot.id} className="flex justify-between items-center mt-2">
                                    <div className="flex gap-2 items-center">
                                        <strong>Slot {index + 1}:</strong>
                                        <span>{formatTime(slot.from)} to {formatTime(slot.to)}</span>
                                    </div>
                                    {slot.is_edit_delete && (
                                        <div className="flex gap-2">
                                            {!slot.isNew && (
                                                <Button
                                                    variant="outline-success"
                                                    label="Edit"
                                                    onClick={() => {
                                                        setEditingSlot({ slotIndex: index, slotData: slot });
                                                        setSelectedDay(day);
                                                        setIsTimeSlotOpen(true);
                                                    }}
                                                />
                                            )}
                                            <Button
                                                variant="danger"
                                                label="Delete"
                                                onClick={() => {
                                                    setDeletingSlot({ type: 'specific', slotId: slot.id, dayOfWeek: i, index });
                                                    setIsDeleteModalOpen(true);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                    <div className="flex justify-end">
                        <Button onClick={handleSaveSpecificDayTimings} variant="primary" label="Save Specific Day Timings" />
                    </div>
                </div>
            )}

            <TimeSlotModal
                isOpen={isTimeSlotOpen}
                onClose={() => {
                    setIsTimeSlotOpen(false);
                    setEditingSlot(null);
                    setSelectedDay(null);
                }}
                defaultFrom={editingSlot?.slotData.from}
                defaultTo={editingSlot?.slotData.to}
                existingSlots={
                    activeTab === 'all'
                        ? allDaySlots
                        : selectedDay
                            ? specificDaySlots[selectedDay]
                            : []
                }
                actionLabel={editingSlot ? 'Update Slot' : 'Add Slot'}
                onSubmit={onSubmitSlot}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                title="Confirm Delete"
                onDelete={deleteSlot}
                onClose={closeDelete}
                actionLoading={deleteLoading}
            />
        </div>
    );
};

export default Timings;
