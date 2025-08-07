import { useEffect, useState } from "react";
import Tabs from "../../../components/Ui/Tabs";
import Button from "../../../components/Ui/Button";
import TimeSlotModal from "../../../components/modals/TimeSlotModal";
import DeleteModal from "../../../components/modals/DeleteModal";
import { addRestaurantTimings, deleteRestaurantTiming, updateOnlineStatusOfSpecifiedDay, updateRestaurantTiming } from "../../../api/timingsApi";
import { useVendor } from "../../../lib/Context/VendorContext";
import { toast } from "react-toastify";
import type {
    RestaurantTiming,
    Slot,
    EditingSlot,
    RestaurantTimingPayload,
} from '../../../types/types';
import Loader from "../../../components/loader/Loader";
import Switcher from "../../../components/Ui/Switcher";
import MenuIcon from "../../../lib/MenuIcon";

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Timings: React.FC = () => {
    const { vendor, fetchVendor, loading } = useVendor();
    const timing = vendor && vendor?.restaurant?.timings as RestaurantTiming | undefined;

    const [activeTab, setActiveTab] = useState<'all' | 'specific'>('all');
    const [allDaySlots, setAllDaySlots] = useState<Slot[]>([]);
    console.log({ allDaySlots });

    const [specificDaySlots, setSpecificDaySlots] = useState<
        Record<string, { outlet_status: boolean; timings: Slot[] }>
    >(
        daysOfWeek.reduce((acc, d) => {
            acc[d] = { outlet_status: false, timings: [] };
            return acc;
        }, {} as Record<string, { outlet_status: boolean; timings: Slot[] }>)
    );
    console.log({ specificDaySlots });

    const [isSubmitting, setIsSubmitting] = useState(false);
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
                    acc[d] = { outlet_status: false, timings: [] };
                    return acc;
                }, {} as Record<string, { outlet_status: boolean; timings: Slot[] }>)
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
            const specific: Record<string, { outlet_status: boolean; timings: Slot[] }> = {};

            timing.specified.forEach((dayTiming, i) => {
                const day = daysOfWeek[i];
                specific[day] = {
                    outlet_status: dayTiming?.outlet_status,
                    timings: dayTiming && dayTiming?.timings?.map((slot) => ({
                        id: Date.now() + Math.random(),
                        from: slot.open_times,
                        to: slot.close_time,
                        is_edit_delete: slot.is_edit_delete,
                        timing_id: slot._id,
                    })),
                };
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
                    index: index!, // Ensure index is not undefined
                    is_all_day: true,
                    // outlet_status: false,
                });

                toast.success('Slot deleted.');

                // Remove the deleted slot from UI
                setAllDaySlots((prev) => prev.filter((_, i) => i !== index));

                // Close the modal or confirmation UI
                closeDelete();
            } catch (error) {
                console.error('Error deleting slot:', error); // Helpful for debugging
                toast.error('Delete failed.');
            } finally {
                setDeleteLoading(false); // Always reset loading state
            }

        } else {
            const dow = dayOfWeek!;
            const dayName = daysOfWeek[dow];
            const slot = specificDaySlots[dayName].timings.find((s) => s.id === slotId);

            if (slot?.isNew) {
                setSpecificDaySlots((prev) => ({
                    ...prev,
                    [dayName]: {
                        ...prev[dayName],
                        timings: prev[dayName].timings.filter((s) => s.id !== slotId),
                    },
                }));
                closeDelete();
                return;
            }

            try {
                setDeleteLoading(true);
               const response =  await deleteRestaurantTiming({
                    restaurant_id,
                    day_of_week: Number(dow) + 1,
                    index: index!,
                    is_all_day: false,
                    // outlet_status: false,
                });

                toast.success(response?.message || 'Record deleted successfully!');

                setSpecificDaySlots((prev) => {
                    const arr = [...prev[dayName].timings];
                    arr.splice(index!, 1);
                    return {
                        ...prev,
                        [dayName]: {
                            ...prev[dayName],
                            timings: arr,
                        },
                    };
                });

                closeDelete();
                fetchVendor();
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
            setIsSubmitting(true);
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
            setAllDaySlots((prev) =>
                (Array.isArray(prev) ? prev : []).map((s) => ({ ...s, isNew: false }))
            );
            toast.success('All-day timings saved.');
        } catch {
            toast.error('Save failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveSpecificDayTimings = async () => {
        if (!vendor_id || !restaurant_id) {
            toast.error('Missing vendor or restaurant ID');
            return;
        }

        try {
            setIsSubmitting(true);

            const specified = daysOfWeek.map((day, i) => {
                const dayData = specificDaySlots?.[day] || {
                    outlet_status: false,
                    timings: [],
                };

                const timingsArray = Array.isArray(dayData.timings) ? dayData.timings : [];

                return {
                    outlet_status: dayData.outlet_status || false,
                    timings: timingsArray
                        .filter(slot => slot?.from && slot?.to)
                        .map((slot) => ({
                            open_times: slot.from,
                            close_time: slot.to,
                            days_of_week: i,
                            is_edit_delete: slot.is_edit_delete,
                        })),
                };
            });

            const payload: RestaurantTimingPayload = {
                vendor_id,
                restaurant_id,
                timings: {
                    is_all_day: false,
                    all_days: { outlet_status: false, timings: [] },
                    specified,
                },
            };

            const response = await addRestaurantTimings(payload);
            toast.success(response?.message || 'Restaurant updated successfully');
            // Clean up: mark all specific slots as not new
            setSpecificDaySlots((prev) => {
                const updated: Record<string, { outlet_status: boolean; timings: Slot[] }> = {};
                daysOfWeek.forEach((day) => {
                    const existing = prev[day] || {
                        outlet_status: false,
                        timings: [],
                    };

                    const safeTimings = Array.isArray(existing.timings) ? existing.timings : [];

                    updated[day] = {
                        outlet_status: existing.outlet_status,
                        timings: safeTimings.map((slot) => ({
                            ...slot,
                            isNew: false,
                        })),
                    };
                });
                return updated;
            });
            fetchVendor();
        } catch {
            toast.error('Save failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubmitSlot = async ({ startTime, endTime }: { startTime: string; endTime: string }) => {
        if (editingSlot) {
            const { slotIndex, slotData } = editingSlot;
            console.log({ slotData });

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
                        const arr = [...prev[selectedDay].timings];
                        arr[slotIndex] = { ...arr[slotIndex], from: startTime, to: endTime };
                        return {
                            ...prev,
                            [selectedDay]: {
                                ...prev[selectedDay],
                                timings: arr,
                            },
                        };
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
                [selectedDay]: {
                    ...prev[selectedDay],
                    timings: [...(prev[selectedDay]?.timings || []), newSlot],
                },
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
                onTabChange={async (tab: string) => {
                    if (tab !== 'all' && tab !== 'specific') return;

                    setActiveTab(tab);
                    const updatedVendor = await fetchVendor();
                    const updatedTiming = updatedVendor?.restaurant?.timings;

                    if (!updatedTiming) {
                        setAllDaySlots([]);
                        setSpecificDaySlots(
                            daysOfWeek.reduce((acc, d) => {
                                acc[d] = {
                                    outlet_status: false,
                                    timings: [],
                                };
                                return acc;
                            }, {} as Record<string, { outlet_status: boolean; timings: Slot[] }>),
                        );

                        return;
                    }

                    if (updatedTiming.is_all_day && updatedTiming.all_days.timings.length > 0) {
                        const slots: Slot[] = updatedTiming.all_days.timings.map((item: any) => ({
                            id: Date.now() + Math.random(),
                            from: item.open_times,
                            to: item.close_time,
                            is_edit_delete: item.is_edit_delete,
                            timing_id: item._id,
                        }));
                        setAllDaySlots(slots);
                        // clear specific day slots
                        setSpecificDaySlots(
                            daysOfWeek.reduce((acc, d) => {
                                acc[d] = {
                                    outlet_status: false,
                                    timings: [],
                                };
                                return acc;
                            }, {} as Record<string, { outlet_status: boolean; timings: Slot[] }>),
                        );

                    } else {
                        // reset all day slots
                        setAllDaySlots([]);

                        // ensure all 7 days are defined, even if some have 0 slots
                        const specific: Record<string, Slot[]> = daysOfWeek.reduce((acc, day, index) => {
                            const dayTimings = updatedTiming?.specified?.[index]?.timings || [];
                            acc[day] = dayTimings.map((slot: any) => ({
                                id: Date.now() + Math.random(),
                                from: slot.open_times,
                                to: slot.close_time,
                                is_edit_delete: slot.is_edit_delete,
                                timing_id: slot._id,
                            }));
                            return acc;
                        }, {} as Record<string, Slot[]>);

                        const specificWrapped = Object.fromEntries(
                            Object.entries(specific).map(([day, slots]) => [
                                day,
                                { outlet_status: false, timings: slots },
                            ])
                        );
                        setSpecificDaySlots(specificWrapped); // ✅ Correct

                    }
                }}
            />
            {loading ? <Loader /> : (
                <div>
                    {activeTab === 'all' && (
                        <div className="p-4 space-y-3">
                            <div className="flex justify-between">
                                <h3 className="text-lg font-semibold">All Days</h3>
                                {allDaySlots.length < 2 && (
                                    <Button onClick={() => setIsTimeSlotOpen(true)} variant="primary" label="Add Timing" iconLeft={<MenuIcon name="add" />}/>
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
                                                    iconLeft={<MenuIcon name="edit" />}
                                                    onClick={() => {
                                                        setEditingSlot({ slotIndex: index, slotData: slot });
                                                        setIsTimeSlotOpen(true);
                                                    }}
                                                />
                                            )}
                                            <Button
                                                variant="danger"
                                                label="Delete"
                                                 iconLeft={<MenuIcon name="delete" />}
                                                onClick={() => {
                                                    setDeletingSlot({ type: 'all', slotId: slot.id, index });
                                                    setIsDeleteModalOpen(true);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {allDaySlots?.length > 0 && (
                                <div className="flex justify-end">
                                    <Button onClick={handleSaveAllDaysTimings}
                                        disabled={isSubmitting}
                                        loading={isSubmitting}
                                        variant="primary" label="Save All Day Timings" />
                                </div>
                            )}

                        </div>
                    )}

                    {activeTab === 'specific' && (
                        <div className="p-4 space-y-4">
                            {daysOfWeek.map((day, i) => (
                                <div key={day} className="border-b pb-2">
                                    <div className="flex justify-between">
                                        <div className="flex justify-between gap-2">
                                            <h3 className="font-semibold">{day}</h3>
                                            {specificDaySlots?.[day]?.timings?.length > 0 && specificDaySlots?.[day]?.outlet_status === true && (
                                                <Switcher
                                                    initial={specificDaySlots?.[day]?.outlet_status || false}
                                                    onClick={async (newStatus: boolean) => {
                                                        console.log(`Outlet status for ${day} changed to:`, newStatus);
                                                        try {
                                                            const response = await updateOnlineStatusOfSpecifiedDay({
                                                                restaurant_id: restaurant_id, // Ensure this is defined in scope
                                                                status: newStatus,
                                                                day: i + 1, // Make sure `index` corresponds to this day (e.g., 0 = Sunday)
                                                            });
                                                            console.log({ response });
                                                            toast.success(response?.message || "Day online status updated!")
                                                            // Update local UI state
                                                            setSpecificDaySlots((prev) => ({
                                                                ...prev,
                                                                [day]: {
                                                                    ...prev[day],
                                                                    status: newStatus,
                                                                },
                                                            }));
                                                        } catch (error) {
                                                            console.error("Failed to update outlet status:", error);
                                                        }
                                                    }}
                                                />
                                            )}

                                        </div>
                                        {(specificDaySlots[day]?.timings || []).length < 2 && (
                                            <Button
                                                label="Add Timing"
                                                variant="primary"
                                                  iconLeft={<MenuIcon name="add" />}
                                                onClick={() => {
                                                    setSelectedDay(day);
                                                    setIsTimeSlotOpen(true);
                                                }}
                                            />
                                        )}

                                    </div>

                                    {specificDaySlots && specificDaySlots[day]?.timings?.map((slot, index) => (
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
                                                              iconLeft={<MenuIcon name="edit" />}
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
                                                          iconLeft={<MenuIcon name="delete" />}
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
                                <Button
                                    onClick={handleSaveSpecificDayTimings}
                                    variant="primary" label="Save Specific Day Timings"
                                    disabled={isSubmitting}
                                    loading={isSubmitting} />
                            </div>
                        </div>
                    )}
                </div>
            )}

            <TimeSlotModal
                isOpen={isTimeSlotOpen}
                onClose={() => {
                    setIsTimeSlotOpen(false);
                    setEditingSlot(null);
                    setSelectedDay(null);
                }}
                editingSlot={editingSlot}
                defaultFrom={editingSlot?.slotData.from}
                defaultTo={editingSlot?.slotData.to}
                existingSlots={
                    activeTab === 'all'
                        ? allDaySlots.map(s => ({ ...s, id: String(s.id) }))
                        : selectedDay
                            ? (specificDaySlots[selectedDay]?.timings ?? []).map(s => ({ ...s, id: String(s.id) }))
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
