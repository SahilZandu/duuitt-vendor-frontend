import { useEffect, useState } from "react";
import Tabs from "../../../components/Ui/Tabs";
import Button from "../../../components/Ui/Button";
import TimeSlotModal from "../../../components/modals/TimeSlotModal";
import DeleteModal from "../../../components/modals/DeleteModal";
import {
  addRestaurantTimings,
  deleteRestaurantTiming,
  updateOnlineStatusOfSpecifiedDay,
  //   updateRestaurantTiming,
} from "../../../api/timingsApi";
import { useVendor } from "../../../lib/Context/VendorContext";
import { toast } from "react-toastify";
import type {
  RestaurantTiming,
  Slot,
  EditingSlot,
  RestaurantTimingPayload,
} from "../../../types/types";
import Loader from "../../../components/loader/Loader";
import Switcher from "../../../components/Ui/Switcher";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Timings: React.FC = () => {
  const { vendor, fetchVendor, loading } = useVendor();
  const timing = vendor?.restaurant?.timings as RestaurantTiming | undefined;

  const [activeTab, setActiveTab] = useState<"all" | "specific">("all");
  const [allDaySlots, setAllDaySlots] = useState<Slot[]>([]);
  const [specificDaySlots, setSpecificDaySlots] = useState<
    Record<string, { outlet_status: boolean; timings: Slot[] }>
  >(
    daysOfWeek.reduce((acc, d) => {
      acc[d] = { outlet_status: false, timings: [] };
      return acc;
    }, {} as Record<string, { outlet_status: boolean; timings: Slot[] }>)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [editingSlot, setEditingSlot] = useState<EditingSlot | null>(null);
  const [isTimeSlotOpen, setIsTimeSlotOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingSlot, setDeletingSlot] = useState<{
    type: "all" | "specific";
    slotId: number;
    dayOfWeek?: number;
    index?: number;
  } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const vendor_id = localStorage.getItem("vendor_id");
  const restaurant_id = localStorage.getItem("restaurant_id");

  const formatTime = (time24: string) => {
    const [h, m] = time24.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hr12 = h % 12 || 12;
    return `${hr12}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  // ---------- Fetch timings ----------
  useEffect(() => {
    if (!timing) {
      setAllDaySlots([]);
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
      const specific: Record<
        string,
        { outlet_status: boolean; timings: Slot[] }
      > = {};
      timing.specified.forEach((dayTiming, i) => {
        const day = daysOfWeek[i];
        specific[day] = {
          outlet_status: dayTiming?.outlet_status || false,
          timings:
            dayTiming?.timings?.map((slot) => ({
              id: Date.now() + Math.random(),
              from: slot.open_times,
              to: slot.close_time,
              is_edit_delete: slot.is_edit_delete,
              timing_id: slot._id,
            })) || [],
        };
      });
      setSpecificDaySlots(specific);
    }
  }, [timing]);

  // ---------- Delete Slot ----------
  const deleteSlot = async () => {
    if (!deletingSlot || !restaurant_id) return;
    const { type, dayOfWeek, index } = deletingSlot;

    try {
      setDeleteLoading(true);
      if (type === "all") {
        await deleteRestaurantTiming({
          restaurant_id,
          day_of_week: 0,
          index: index!,
          is_all_day: true,
        });
        setAllDaySlots((prev) => prev.filter((_, i) => i !== index));
      } else {
        const dow = dayOfWeek!;
        const dayName = daysOfWeek[dow];
        await deleteRestaurantTiming({
          restaurant_id,
          day_of_week: dow + 1, // ⚠️ adjust if API uses 0 = Monday
          index: index!,
          is_all_day: false,
        });
        setSpecificDaySlots((prev) => {
          const arr = [...prev[dayName].timings];
          arr.splice(index!, 1);
          return { ...prev, [dayName]: { ...prev[dayName], timings: arr } };
        });
      }
      toast.success("Slot deleted.");
    } catch {
      toast.error("Delete failed.");
    } finally {
      closeDelete();
    }
  };

  const closeDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingSlot(null);
    setDeleteLoading(false);
  };

  // ---------- Save ----------
  const handleSaveAllDaysTimings = async () => {
    if (!vendor_id || !restaurant_id) {
      toast.error("Missing vendor or restaurant ID");
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
      toast.success("All-day timings saved.");
    } catch {
      toast.error("Save failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveSpecificDayTimings = async () => {
    if (!vendor_id || !restaurant_id) {
      toast.error("Missing vendor or restaurant ID");
      return;
    }
    try {
      setIsSubmitting(true);
      const specified = daysOfWeek.map((day, i) => ({
        outlet_status: specificDaySlots[day]?.outlet_status || false,
        timings: (specificDaySlots[day]?.timings || []).map((slot) => ({
          open_times: slot.from,
          close_time: slot.to,
          days_of_week: i,
          is_edit_delete: slot.is_edit_delete,
        })),
      }));
      await addRestaurantTimings({
        vendor_id,
        restaurant_id,
        timings: {
          is_all_day: false,
          all_days: { outlet_status: false, timings: [] },
          specified,
        },
      });
      toast.success("Specific day timings saved.");
      fetchVendor();
    } catch {
      toast.error("Save failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- Add / Edit Slot ----------
  const onSubmitSlot = ({
    startTime,
    endTime,
  }: {
    startTime: string;
    endTime: string;
  }) => {
    const newSlot: Slot = {
      id: Date.now(),
      from: startTime,
      to: endTime,
      is_edit_delete: true,
      isNew: true,
    };
    if (activeTab === "all") {
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

  // Fix 1: Create a wrapper function for onTabChange to handle the type conversion
  const handleTabChange = (tab: "all" | "specific") => {
    setActiveTab(tab);
  };

  // ---------- Render ----------
  const tabOptions = [
    { label: "All Days", value: "all" as const, icon: "allDays" },
    {
      label: "Specific Days",
      value: "specific" as const,
      icon: "specificDays",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <Tabs
        tabs={tabOptions}
        activeTab={activeTab}
        onTabChange={handleTabChange} // Fixed: Use wrapper function
      />

      {loading ? (
        <Loader />
      ) : (
        <div>
          {/* ---- All Days ---- */}
          {activeTab === "all" && (
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-semibold">All Days</h3>
              {allDaySlots.map((slot, index) => (
                <div
                  key={slot.id}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded"
                >
                  <span>
                    {formatTime(slot.from)} - {formatTime(slot.to)}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline-success"
                      label="Edit"
                      onClick={() => {
                        setEditingSlot({ slotIndex: index, slotData: slot });
                        setIsTimeSlotOpen(true);
                      }}
                    />
                    <Button
                      variant="danger"
                      label="Delete"
                      onClick={() => {
                        setDeletingSlot({
                          type: "all",
                          slotId: slot.id,
                          index,
                        });
                        setIsDeleteModalOpen(true);
                      }}
                    />
                  </div>
                </div>
              ))}
              {allDaySlots.length < 2 && (
                <Button
                  label="Add Timing"
                  onClick={() => setIsTimeSlotOpen(true)}
                />
              )}
              {allDaySlots.length > 0 && (
                <Button
                  label="Save All Day Timings"
                  onClick={handleSaveAllDaysTimings}
                  loading={isSubmitting}
                />
              )}
            </div>
          )}

          {/* ---- Specific Days ---- */}
          {activeTab === "specific" && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {daysOfWeek.map((day, i) => (
                <div
                  key={day}
                  className="border rounded-xl p-3 shadow-sm bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{day}</h4>
                    <Switcher
                      initial={specificDaySlots[day]?.outlet_status || false}
                      onClick={async (newStatus: boolean) => {
                        try {
                          await updateOnlineStatusOfSpecifiedDay({
                            restaurant_id,
                            status: newStatus,
                            day: i + 1,
                          });
                          setSpecificDaySlots((prev) => ({
                            ...prev,
                            [day]: { ...prev[day], outlet_status: newStatus },
                          }));
                        } catch {
                          toast.error("Status update failed");
                        }
                      }}
                    />
                  </div>
                  <div className="mt-2 space-y-2">
                    {specificDaySlots[day]?.timings?.map((slot, index) => (
                      <div
                        key={slot.id}
                        className="flex justify-between items-center bg-white p-2 rounded border"
                      >
                        <span>
                          {formatTime(slot.from)} - {formatTime(slot.to)}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline-success"
                            label="Edit"
                            onClick={() => {
                              setEditingSlot({
                                slotIndex: index,
                                slotData: slot,
                              });
                              setSelectedDay(day);
                              setIsTimeSlotOpen(true);
                            }}
                          />
                          <Button
                            variant="danger"
                            label="Delete"
                            onClick={() => {
                              setDeletingSlot({
                                type: "specific",
                                slotId: slot.id,
                                dayOfWeek: i,
                                index,
                              });
                              setIsDeleteModalOpen(true);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {specificDaySlots[day]?.timings.length < 2 && (
                    <Button
                      className="mt-2"
                      label="Add Timing"
                      onClick={() => {
                        setSelectedDay(day);
                        setIsTimeSlotOpen(true);
                      }}
                    />
                  )}
                </div>
              ))}
              <div className="col-span-full flex justify-end">
                <Button
                  label="Save Specific Day Timings"
                  onClick={handleSaveSpecificDayTimings}
                  loading={isSubmitting}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---- Modals ---- */}
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
          // Fix 2: Convert number IDs to strings
          activeTab === "all"
            ? allDaySlots.map((slot) => ({
                id: slot.id.toString(),
                from: slot.from,
                to: slot.to,
              }))
            : selectedDay
            ? (specificDaySlots[selectedDay]?.timings || []).map((slot) => ({
                id: slot.id.toString(),
                from: slot.from,
                to: slot.to,
              }))
            : []
        }
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
