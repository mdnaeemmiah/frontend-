/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

// Static appointments data
const STATIC_APPOINTMENTS = [
  {
    _id: "1",
    patientName: "John Smith",
    patientEmail: "john.smith@email.com",
    patientPhone: "+880 1712345678",
    appointmentDate: new Date().toISOString(),
    appointmentTime: "10:00 AM",
    appointmentType: "virtual",
    reason: "Regular checkup and blood pressure monitoring",
    status: "approved",
    adminNotes: "Patient has history of hypertension",
  },
  {
    _id: "2",
    patientName: "Emily Johnson",
    patientEmail: "emily.j@email.com",
    patientPhone: "+880 1723456789",
    appointmentDate: new Date().toISOString(),
    appointmentTime: "11:30 AM",
    appointmentType: "in-person",
    reason: "Follow-up consultation for cardiac evaluation",
    status: "approved",
    adminNotes: null,
  },
  {
    _id: "3",
    patientName: "Michael Brown",
    patientEmail: "m.brown@email.com",
    patientPhone: "+880 1734567890",
    appointmentDate: new Date(Date.now() + 86400000).toISOString(),
    appointmentTime: "2:00 PM",
    appointmentType: "virtual",
    reason: "Chest pain and breathing difficulties",
    status: "approved",
    adminNotes: "Urgent case - requires immediate attention",
  },
  {
    _id: "4",
    patientName: "Sarah Davis",
    patientEmail: "sarah.davis@email.com",
    patientPhone: "+880 1745678901",
    appointmentDate: new Date(Date.now() + 172800000).toISOString(),
    appointmentTime: "9:00 AM",
    appointmentType: "in-person",
    reason: "Annual cardiac screening and ECG test",
    status: "approved",
    adminNotes: null,
  },
  {
    _id: "5",
    patientName: "David Wilson",
    patientEmail: "d.wilson@email.com",
    patientPhone: "+880 1756789012",
    appointmentDate: new Date(Date.now() + 259200000).toISOString(),
    appointmentTime: "3:30 PM",
    appointmentType: "virtual",
    reason: "Medication review and prescription renewal",
    status: "completed",
    adminNotes: "Patient is on beta blockers",
  },
];

export default function DoctorAppointments() {
  const [appointments] = useState<any[]>(STATIC_APPOINTMENTS);
  const [filter, setFilter] = useState("all");

  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const upcomingAppointments = appointments.filter(
    (a) => new Date(a.appointmentDate) >= new Date() && a.status === "approved"
  );

  const completedAppointments = appointments.filter(
    (a) => a.status === "completed"
  );

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#ebe2cd] rounded-lg flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {appointments.length}
              </p>
              <p className="text-gray-600">Total Appointments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {upcomingAppointments.length}
              </p>
              <p className="text-gray-600">Upcoming</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#ebe2cd] rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {completedAppointments.length}
              </p>
              <p className="text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-semibold text-gray-700">Filter:</span>
          {["all", "approved", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Appointments ({filteredAppointments.length})
          </h2>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-600 font-medium">No appointments found</p>
            <p className="text-sm text-gray-500 mt-2">
              Approved appointments will appear here
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {appointment.patientName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          appointment.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-[#ebe2cd] text-[#2952a1]"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span>
                        📅{" "}
                        {new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <span>🕐 {appointment.appointmentTime}</span>
                      <span>•</span>
                      <span>
                        {appointment.appointmentType === "virtual"
                          ? "💻 Virtual"
                          : "🏥 In-Person"}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Reason for Visit:
                      </p>
                      <p className="text-sm text-gray-700">
                        {appointment.reason}
                      </p>
                    </div>

                    {appointment.adminNotes && (
                      <div className="bg-[#ebe2cd]/30 rounded-lg p-4 mb-4">
                        <p className="text-sm font-semibold text-[#2952a1] mb-2">
                          Admin Notes:
                        </p>
                        <p className="text-sm text-[#2952a1]">
                          {appointment.adminNotes}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>📧 {appointment.patientEmail}</span>
                      {appointment.patientPhone && (
                        <>
                          <span>•</span>
                          <span>📱 {appointment.patientPhone}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
