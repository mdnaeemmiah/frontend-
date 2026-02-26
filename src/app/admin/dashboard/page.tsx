/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaCheck, FaArrowRight } from "react-icons/fa";
import img1 from "@/assets/img (1).png";
import { getAdminDashboard, AdminAppointment } from "@/service/adminService";

// Default stats for loading state
const DEFAULT_STATS = {
  totalPatients: 0,
  totalDoctors: 0,
  totalAppointments: 0,
  pendingAppointments: 0,
  verifiedDoctors: 0,
  pendingDoctors: 0,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [recentAppointments, setRecentAppointments] = useState<AdminAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAdminDashboard();
      
      // Update stats from the comprehensive API response
      setStats({
        totalPatients: response.users.total_patients,
        totalDoctors: response.users.total_doctors,
        totalAppointments: response.appointments.total,
        pendingAppointments: response.appointments.pending,
        verifiedDoctors: response.doctors.verified,
        pendingDoctors: response.doctors.pending,
      });
      
      // Update recent appointments (show most recent 5)
      setRecentAppointments(response.appointments.all_appointments.slice(0, 5));
    } catch (err) {
      console.error("Error fetching admin dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#ebe2cd] rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? "..." : stats.totalPatients}
          </h3>
          <p className="text-gray-600">Total Patients</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#ebe2cd] rounded-lg flex items-center justify-center">
              <span className="text-2xl">👨‍⚕️</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? "..." : stats.totalDoctors}
          </h3>
          <p className="text-gray-600">Total Doctors</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? "..." : stats.totalAppointments}
          </h3>
          <p className="text-gray-600">Total Appointments</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? "..." : stats.pendingAppointments}
          </h3>
          <p className="text-gray-600">Pending Appointments</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? "..." : stats.verifiedDoctors}
          </h3>
          <p className="text-gray-600">Verified Doctors</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏸️</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? "..." : stats.pendingDoctors}
          </h3>
          <p className="text-gray-600">Pending Doctors</p>
        </div>
      </div>

  

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#1F2937]">
            Recent Appointments
          </h2>
          <Link
            href="/admin/appointments"
            className="flex items-center gap-2 text-gray-900 font-bold hover:text-[#0052CC] transition-colors"
          >
            View All <FaArrowRight className="text-sm" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading appointments...</div>
        ) : recentAppointments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <p className="text-gray-500 font-medium">No appointments yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-2 bg-[#F9FAFB] hover:bg-gray-100 transition-colors rounded-[16px]"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-100">
                    {appointment.patient_info.profile_picture ? (
                      <img
                        src={appointment.patient_info.profile_picture}
                        alt={appointment.patient_info.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`${appointment.patient_info.profile_picture ? 'hidden' : ''} w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs font-bold`}>
                      {appointment.patient_info.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#1F2937] leading-tight">
                      {appointment.patient_info.name}
                    </h4>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                      {appointment.appointment_details.display}
                    </p>
                    <p className="text-xs text-gray-400">
                      {appointment.doctor_info.name} • {appointment.booking_id}
                    </p>
                    <p className="text-xs text-gray-400">
                      {appointment.reason}
                    </p>
                  </div>
                </div>

                <div>
                  {appointment.status.toLowerCase() === "approved" || appointment.status.toLowerCase() === "confirmed" ? (
                    <button className="flex items-center gap-2 bg-[#0052CC] text-white px-8 py-2.5 rounded-[10px] font-bold text-sm shadow-sm hover:bg-[#0041a3] transition-all">
                      <FaCheck className="text-xs" /> Approved
                    </button>
                  ) : (
                    <div className="bg-[#FEF3E2] text-[#B45309] px-8 py-2.5 rounded-[10px] font-bold text-sm flex items-center justify-center min-w-[124px]">
                      {appointment.status}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
