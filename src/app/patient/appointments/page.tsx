/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import { getPatientAppointments, PatientAppointmentItem } from "@/service/doctorService";
import { toast, Toaster } from "sonner";



export default function PatientAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<PatientAppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "reject">("all");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    upcoming: 0,
    past: 0,
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await getPatientAppointments();
      
      if (response.success && response.appointments) {
        setAppointments(response.appointments.all_appointments || []);
        setStats({
          total: response.appointments.total || 0,
          pending: response.appointments.pending || 0,
          approved: response.appointments.approved || 0,
          upcoming: response.appointments.upcoming || 0,
          past: response.appointments.past || 0,
        });
      }
    } catch (error: any) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments", {
        description: error.message || "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "reject":
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
      case "reject":
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

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#ebe2cd] via-white to-[#ebe2cd]/50 flex items-center justify-center">
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
    <div className="min-h-screen bg-[#2952a1]">
      <Toaster position="top-right" richColors />
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            My Appointments
          </h1>
          <p className="text-gray-200">
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
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                filter === "pending"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ⏳ Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                filter === "approved"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ✅ Approved ({stats.approved})
            </button>
            <button
              onClick={() => setFilter("reject")}
              className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                filter === "reject"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ❌ Rejected ({stats.total - stats.pending - stats.approved})
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
              className="bg-linear-to-r from-[#2952a1] to-[#1e3d7a] text-white px-8 py-3 rounded-xl font-semibold hover:from-[#1e3d7a] hover:to-[#2952a1] transition-all"
            >
              Find Doctors
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start space-x-4 mb-4">
                  {/* Doctor Profile Image */}
                  <div className="shrink-0 w-20 h-20">
                    {appointment.doctor.profile_picture ? (
                      <img
                        src={appointment.doctor.profile_picture}
                        alt={appointment.doctor_name}
                        className="w-full h-full rounded-full object-cover border-2 border-[#2952a1]/20"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                        {appointment.doctor_name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {appointment.doctor_name}
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
                    <p className="text-sm text-gray-500 mb-2">{appointment.doctor.specialty_name}</p>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                      <span className="flex items-center">
                        📅{" "}
                        {new Date(
                          appointment.preferred_date
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        🕐 {appointment.preferred_time ? appointment.preferred_time.slice(0, 5) : 'N/A'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        📞 {appointment.contact_method || 'Phone'}
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

                {appointment.status === "reject" && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-800">
                      ❌ Your appointment has been rejected. Please contact
                      support or book another appointment.
                    </p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Booked on{" "}
                    {appointment.created_at ? new Date(appointment.created_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    ) : 'N/A'}
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
