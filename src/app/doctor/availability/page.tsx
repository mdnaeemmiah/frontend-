/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface SpecificDate {
  date: string;
  timeSlots: TimeSlot[];
  isAvailable: boolean;
}

interface DayAvailability {
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  timeSlots: TimeSlot[];
  isAvailable: boolean;
  specificDates?: SpecificDate[];
}

const daysOfWeek = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

export default function DoctorAvailability() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"weekly" | "specific">("weekly");
  const [availability, setAvailability] = useState<DayAvailability[]>(
    daysOfWeek.map((day) => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      day: day.value as any,
      timeSlots: [{ startTime: "09:00", endTime: "17:00" }],
      isAvailable: false,
      specificDates: [],
    }))
  );
  const [specificDates, setSpecificDates] = useState<SpecificDate[]>([]);
  const [newSpecificDate, setNewSpecificDate] = useState({
    date: "",
    startTime: "09:00",
    endTime: "17:00",
  });

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:5000/api/user/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();
      if (
        result.success &&
        result.data.availability &&
        result.data.availability.length > 0
      ) {
        const availData = result.data.availability.map((avail: any) => ({
          ...avail,
          specificDates:
            avail.specificDates?.map((sd: any) => ({
              date: new Date(sd.date).toISOString().split("T")[0],
              timeSlots: sd.timeSlots,
              isAvailable: sd.isAvailable,
            })) || [],
        }));
        setAvailability(availData);

        const allSpecificDates: SpecificDate[] = [];
        availData.forEach((day: any) => {
          if (day.specificDates) {
            allSpecificDates.push(...day.specificDates);
          }
        });
        setSpecificDates(allSpecificDates);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (dayIndex: number) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].isAvailable =
      !newAvailability[dayIndex].isAvailable;
    setAvailability(newAvailability);
  };

  const handleTimeSlotChange = (
    dayIndex: number,
    slotIndex: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].timeSlots[slotIndex][field] = value;
    setAvailability(newAvailability);
  };

  const addTimeSlot = (dayIndex: number) => {
    const newAvailability = [...availability];
    newAvailability[dayIndex].timeSlots.push({
      startTime: "09:00",
      endTime: "17:00",
    });
    setAvailability(newAvailability);
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const newAvailability = [...availability];
    if (newAvailability[dayIndex].timeSlots.length > 1) {
      newAvailability[dayIndex].timeSlots.splice(slotIndex, 1);
      setAvailability(newAvailability);
    }
  };

  const addSpecificDate = () => {
    if (!newSpecificDate.date) {
      alert("Please select a date");
      return;
    }

    const newDate: SpecificDate = {
      date: newSpecificDate.date,
      timeSlots: [
        {
          startTime: newSpecificDate.startTime,
          endTime: newSpecificDate.endTime,
        },
      ],
      isAvailable: true,
    };

    setSpecificDates([...specificDates, newDate]);
    setNewSpecificDate({ date: "", startTime: "09:00", endTime: "17:00" });
  };

  const removeSpecificDate = (index: number) => {
    setSpecificDates(specificDates.filter((_, i) => i !== index));
  };

  const handleSpecificDateTimeChange = (
    index: number,
    slotIndex: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const newSpecificDates = [...specificDates];
    newSpecificDates[index].timeSlots[slotIndex][field] = value;
    setSpecificDates(newSpecificDates);
  };

  const addSpecificDateTimeSlot = (index: number) => {
    const newSpecificDates = [...specificDates];
    newSpecificDates[index].timeSlots.push({
      startTime: "09:00",
      endTime: "17:00",
    });
    setSpecificDates(newSpecificDates);
  };

  const removeSpecificDateTimeSlot = (dateIndex: number, slotIndex: number) => {
    const newSpecificDates = [...specificDates];
    if (newSpecificDates[dateIndex].timeSlots.length > 1) {
      newSpecificDates[dateIndex].timeSlots.splice(slotIndex, 1);
      setSpecificDates(newSpecificDates);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedAvailability = availability.map((day) => ({
        ...day,
        specificDates: specificDates,
      }));

      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:5000/api/doctor/my-availability`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ availability: updatedAvailability }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Availability updated successfully!");
        router.push("/doctor/dashboard");
      } else {
        alert(result.message || "Failed to update availability");
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("Failed to update availability");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push("/doctor/dashboard")}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Set Availability
          </h1>
          <p className="text-gray-600">
            Manage your weekly schedule and specific dates for appointments
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("weekly")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "weekly"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300"
            }`}
          >
            📅 Weekly Schedule
          </button>
          <button
            onClick={() => setActiveTab("specific")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "specific"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300"
            }`}
          >
            📍 Specific Dates ({specificDates.length})
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-8 space-y-6"
        >
          {activeTab === "weekly" && (
            <div className="space-y-6">
              {availability.map((dayAvail, dayIndex) => (
                <div
                  key={dayAvail.day}
                  className="border-2 border-gray-200 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={dayAvail.isAvailable}
                          onChange={() => handleDayToggle(dayIndex)}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                      <h3 className="text-xl font-bold text-gray-900">
                        {daysOfWeek[dayIndex].label}
                      </h3>
                    </div>
                    {dayAvail.isAvailable && (
                      <button
                        type="button"
                        onClick={() => addTimeSlot(dayIndex)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                      >
                        + Add Time Slot
                      </button>
                    )}
                  </div>

                  {dayAvail.isAvailable && (
                    <div className="space-y-3">
                      {dayAvail.timeSlots.map((slot, slotIndex) => (
                        <div
                          key={slotIndex}
                          className="flex items-center gap-4"
                        >
                          <div className="flex-1 grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Time
                              </label>
                              <input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) =>
                                  handleTimeSlotChange(
                                    dayIndex,
                                    slotIndex,
                                    "startTime",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Time
                              </label>
                              <input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) =>
                                  handleTimeSlotChange(
                                    dayIndex,
                                    slotIndex,
                                    "endTime",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                          {dayAvail.timeSlots.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeTimeSlot(dayIndex, slotIndex)
                              }
                              className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove time slot"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {!dayAvail.isAvailable && (
                    <p className="text-gray-500 text-sm">
                      Not available on this day
                    </p>
                  )}
                </div>
              ))}

              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3">
                  Quick Actions:
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const newAvailability = availability.map((day, idx) => ({
                        ...day,
                        isAvailable: idx < 5,
                        timeSlots: [{ startTime: "09:00", endTime: "17:00" }],
                      }));
                      setAvailability(newAvailability);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    Set Weekdays (9 AM - 5 PM)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newAvailability = availability.map((day) => ({
                        ...day,
                        isAvailable: true,
                        timeSlots: [{ startTime: "09:00", endTime: "17:00" }],
                      }));
                      setAvailability(newAvailability);
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
                  >
                    Set All Days (9 AM - 5 PM)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newAvailability = availability.map((day) => ({
                        ...day,
                        isAvailable: false,
                        timeSlots: [{ startTime: "09:00", endTime: "17:00" }],
                      }));
                      setAvailability(newAvailability);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "specific" && (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-blue-300 rounded-2xl p-6 bg-blue-50">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Add Specific Date
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newSpecificDate.date}
                      onChange={(e) =>
                        setNewSpecificDate({
                          ...newSpecificDate,
                          date: e.target.value,
                        })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={newSpecificDate.startTime}
                      onChange={(e) =>
                        setNewSpecificDate({
                          ...newSpecificDate,
                          startTime: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={newSpecificDate.endTime}
                      onChange={(e) =>
                        setNewSpecificDate({
                          ...newSpecificDate,
                          endTime: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addSpecificDate}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  + Add Date
                </button>
              </div>

              {specificDates.length > 0 ? (
                <div className="space-y-4">
                  {specificDates.map((specificDate, dateIndex) => (
                    <div
                      key={dateIndex}
                      className="border-2 border-gray-200 rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-gray-900">
                          📅{" "}
                          {new Date(specificDate.date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeSpecificDate(dateIndex)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove date"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {specificDate.timeSlots.map((slot, slotIndex) => (
                          <div
                            key={slotIndex}
                            className="flex items-center gap-4"
                          >
                            <div className="flex-1 grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Start Time
                                </label>
                                <input
                                  type="time"
                                  value={slot.startTime}
                                  onChange={(e) =>
                                    handleSpecificDateTimeChange(
                                      dateIndex,
                                      slotIndex,
                                      "startTime",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  End Time
                                </label>
                                <input
                                  type="time"
                                  value={slot.endTime}
                                  onChange={(e) =>
                                    handleSpecificDateTimeChange(
                                      dateIndex,
                                      slotIndex,
                                      "endTime",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                            {specificDate.timeSlots.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeSpecificDateTimeSlot(
                                    dateIndex,
                                    slotIndex
                                  )
                                }
                                className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove time slot"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {specificDate.timeSlots.length < 3 && (
                        <button
                          type="button"
                          onClick={() => addSpecificDateTimeSlot(dateIndex)}
                          className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          + Add Time Slot
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No specific dates added yet
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Add specific dates above to set availability for particular
                    days
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "💾 Save Availability"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/doctor/dashboard")}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
