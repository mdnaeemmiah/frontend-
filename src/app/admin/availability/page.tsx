/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

export default function AdminAvailability() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || ""}/api/doctor`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();
      if (result.success) {
        // Filter doctors who have availability slots
        const doctorsWithSlots = result.data.filter(
          (d: any) => d.availabilitySlots && d.availabilitySlots.length > 0
        );
        setDoctors(doctorsWithSlots);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (
    doctorId: string,
    slotId: string,
    status: "approved" | "rejected",
    adminNotes: string = ""
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_API || "https://practice-backend-oauth-image-video.vercel.app"
        }/api/doctor/${doctorId}/availability-slot/${slotId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status, adminNotes }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert(`Availability ${status} successfully!`);
        fetchDoctors();
      } else {
        alert(result.message || "Failed to update availability");
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("Failed to update availability");
    }
  };

  const filteredDoctors = doctors
    .map((doctor) => ({
      ...doctor,
      availabilitySlots: doctor.availabilitySlots.filter(
        (slot: any) => filter === "all" || slot.status === filter
      ),
    }))
    .filter((doctor) => doctor.availabilitySlots.length > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading availability requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-semibold text-gray-700">Filter:</span>
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Availability Requests */}
      <div className="space-y-6">
        {filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-md border border-gray-100 text-center">
            <p className="text-gray-500">No availability requests found</p>
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-xl shadow-md border border-gray-100"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  {doctor.profileImg && (
                    <img
                      src={doctor.profileImg}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Dr. {doctor.name}
                    </h3>
                    <p className="text-gray-600">{doctor.specialization}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {doctor.availabilitySlots.map((slot: any) => (
                  <div
                    key={slot.id}
                    className={`p-4 rounded-lg border-2 ${
                      slot.status === "approved"
                        ? "border-green-500 bg-green-50"
                        : slot.status === "rejected"
                        ? "border-red-500 bg-red-50"
                        : "border-yellow-500 bg-yellow-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-lg font-bold text-gray-900">
                            {new Date(slot.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              slot.status === "approved"
                                ? "bg-green-600 text-white"
                                : slot.status === "rejected"
                                ? "bg-red-600 text-white"
                                : "bg-yellow-600 text-white"
                            }`}
                          >
                            {slot.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          🕐 {slot.startTime} - {slot.endTime}
                        </p>
                        {slot.adminNotes && (
                          <div className="bg-white rounded-lg p-3 mt-2">
                            <p className="text-sm font-semibold text-gray-700">
                              Admin Notes:
                            </p>
                            <p className="text-sm text-gray-600">
                              {slot.adminNotes}
                            </p>
                          </div>
                        )}
                      </div>

                      {slot.status === "pending" && (
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              const notes = prompt("Add notes (optional):");
                              handleApproval(
                                doctor._id,
                                slot.id,
                                "approved",
                                notes || ""
                              );
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                          >
                            ✅ Approve
                          </button>
                          <button
                            onClick={() => {
                              const notes = prompt("Reason for rejection:");
                              if (notes) {
                                handleApproval(
                                  doctor._id,
                                  slot.id,
                                  "rejected",
                                  notes
                                );
                              }
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                          >
                            ❌ Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
