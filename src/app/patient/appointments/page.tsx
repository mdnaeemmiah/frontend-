/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";

interface Appointment {
  _id: string;
  doctorName: string;
  doctorImage?: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: "in-person" | "virtual";
  reason: string;
  status: "pending" | "approved" | "rejected" | "completed" | "cancelled";
  adminNotes?: string;
  createdAt: string;
}

// Static appointments data
const STATIC_APPOINTMENTS: Appointment[] = [
  {
    _id: "apt_001",
    doctorName: "Dr. Sarah Johnson",
    doctorImage: "https://i.pravatar.cc/150?img=1",
    appointmentDate: "2026-01-20",
    appointmentTime: "10:00 AM",
    appointmentType: "in-person",
    reason: "Regular checkup and blood pressure monitoring",
    status: "approved",
    adminNotes: "Appointment confirmed. Please arrive 10 minutes early.",
    createdAt: "2026-01-10T08:30:00Z",
  },
  {
    _id: "apt_002",
    doctorName: "Dr. Michael Chen",
    doctorImage: "https://i.pravatar.cc/150?img=2",
    appointmentDate: "2026-01-18",
    appointmentTime: "02:30 PM",
    appointmentType: "virtual",
    reason: "Follow-up consultation for knee pain",
    status: "pending",
    createdAt: "2026-01-14T14:20:00Z",
  },
  {
    _id: "apt_003",
    doctorName: "Dr. Emily Thompson",
    doctorImage: "https://i.pravatar.cc/150?img=3",
    appointmentDate: "2026-01-22",
    appointmentTime: "11:00 AM",
    appointmentType: "in-person",
    reason: "Annual physical examination",
    status: "approved",
    adminNotes: "Please bring your previous medical records.",
    createdAt: "2026-01-12T10:15:00Z",
  },
  {
    _id: "apt_004",
    doctorName: "Dr. David Kumar",
    doctorImage: "https://i.pravatar.cc/150?img=4",
    appointmentDate: "2026-01-16",
    appointmentTime: "09:00 AM",
    appointmentType: "virtual",
    reason: "Consultation for recurring headaches",
    status: "rejected",
    adminNotes: "Doctor not available on this date. Please reschedule.",
    createdAt: "2026-01-13T16:45:00Z",
  },
  {
    _id: "apt_005",
    doctorName: "Dr. Sarah Johnson",
    doctorImage: "https://i.pravatar.cc/150?img=1",
    appointmentDate: "2026-01-25",
    appointmentTime: "03:00 PM",
    appointmentType: "in-person",
    reason: "Cardiology consultation for chest discomfort",
    status: "pending",
    createdAt: "2026-01-15T09:00:00Z",
  },
];

export default function PatientAppointmentsPage() {
  const router = useRouter();
  const [appointments] = useState<Appointment[]>(STATIC_APPOINTMENTS);
  const [loading] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">(
    "all"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "completed":
        return "bg-[#ebe2cd] text-[#2952a1] border-[#2952a1]/30";
      case "cancelled":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "approved":
        return "✅";
      case "rejected":
        return "❌";
      case "completed":
        return "✔️";
      case "cancelled":
        return "🚫";
      default:
        return "📋";
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === "all") return true;
    return apt.status === filter;
  });

  const pendingCount = appointments.filter((apt) => apt.status === "pending")
    .length;
  const approvedCount = appointments.filter((apt) => apt.status === "approved")
    .length;
  const rejectedCount = appointments.filter((apt) => apt.status === "rejected")
    .length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#ebe2cd] via-white to-[#ebe2cd]/50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#ebe2cd] rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#2952a1] rounded-full animate-spin"></div>
          </div>
          <p className="text-xl text-gray-600 font-medium">
            Loading appointments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebe2cd] via-white to-[#ebe2cd]/50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Appointments
          </h1>
          <p className="text-gray-600">
            View and manage your upcoming appointments
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-6">
          <div className="flex gap-3 overflow-x-auto">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                filter === "all"
                  ? "bg-[#2952a1] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({appointments.length})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                filter === "pending"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ⏳ Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                filter === "approved"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ✅ Approved ({approvedCount})
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                filter === "rejected"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ❌ Rejected ({rejectedCount})
            </button>
          </div>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="text-8xl mb-6">📅</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No appointments found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "You haven't booked any appointments yet"
                : `No ${filter} appointments`}
            </p>
            <button
              onClick={() => router.push("/matches")}
              className="bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] text-white px-8 py-3 rounded-xl font-semibold hover:from-[#1e3d7a] hover:to-[#2952a1] transition-all"
            >
              Find Doctors
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start space-x-4 mb-4">
                  {/* Doctor Profile Image */}
                  {appointment.doctorImage && (
                    <div className="flex-shrink-0">
                      <img
                        src={appointment.doctorImage}
                        alt={appointment.doctorName}
                        className="w-20 h-20 rounded-full object-cover border-2 border-[#2952a1]/20"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {appointment.doctorName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {getStatusIcon(appointment.status)}{" "}
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        �{" "}
                        {new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        🕐 {appointment.appointmentTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        {appointment.appointmentType === "virtual"
                          ? "💻 Virtual"
                          : "🏥 In-Person"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Reason for Visit:
                  </p>
                  <p className="text-gray-700">{appointment.reason}</p>
                </div>

                {appointment.adminNotes && (
                  <div
                    className={`rounded-xl p-4 border ${
                      appointment.status === "approved"
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Admin Notes:
                    </p>
                    <p className="text-gray-700">{appointment.adminNotes}</p>
                  </div>
                )}

                {appointment.status === "pending" && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-sm text-yellow-800">
                      ⏳ Your appointment is pending admin approval. You'll be
                      notified once it's reviewed.
                    </p>
                  </div>
                )}

                {appointment.status === "approved" && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-sm text-green-800">
                      ✅ Your appointment has been approved! Please arrive on
                      time.
                    </p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Booked on{" "}
                    {new Date(appointment.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
