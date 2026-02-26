/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaCheck, FaArrowRight } from "react-icons/fa";
import img1 from "@/assets/img (4).png";
import { getDoctorDashboard, Appointment } from "@/service/doctorService";

// Default stats for loading state
const DEFAULT_STATS = {
  todayAppointments: 0,
  totalAppointments: 0,
  totalPatients: 0,
};

export default function DoctorDashboard() {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getDoctorDashboard();
      
      if (response.status === "success") {
        const { data } = response;
        
        // Update stats
        setStats({
          todayAppointments: data.todays_appointments.count,
          totalAppointments: data.total_appointments,
          totalPatients: data.total_patients,
        });
        
        // Update recent appointments (show most recent 5)
        setRecentAppointments(data.all_appointments.slice(0, 5));
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#ebe2cd] rounded-lg flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? "..." : stats.todayAppointments}
          </h3>
          <p className="text-gray-600">Today's Appointments</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#ebe2cd] rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? "..." : stats.totalAppointments}
          </h3>
          <p className="text-gray-600">Total Appointments</p>
        </div>

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
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-[#1F2937]">
            Recent Appointments
          </h3>
          <Link
            href="/doctor/appointments"
            className="flex items-center gap-2 text-gray-900 font-bold hover:text-blue-600 transition-colors"
          >
            View All <FaArrowRight className="text-sm" />
          </Link>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading appointments...</div>
          ) : recentAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No recent appointments found.</div>
          ) : (
            recentAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-2 bg-gray-100 hover:bg-gray-50/50 transition-all rounded-xl"
              >
                <div className="flex items-center gap-5">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                    <Image
                      src={appointment.patient_info.profile_picture || img1}
                      alt={appointment.patient_info.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 leading-tight">
                      {appointment.patient_info.name}
                    </h4>
                    <p className="text-sm text-gray-500 font-medium">
                      {appointment.appointment_details.display}
                    </p>
                    {appointment.patient_info.phone !== "N/A" && (
                      <p className="text-xs text-gray-400">
                        {appointment.patient_info.phone}
                      </p>
                    )}
                  </div>
                </div>
                
                {appointment.status.toLowerCase() === "approved" || appointment.status.toLowerCase() === "confirmed" ? (
                  <button className="flex items-center gap-2 px-8 py-3 bg-[#0052CC] text-white rounded-xl font-bold hover:bg-[#0747A6] transition-all shadow-sm cursor-pointer">
                    <FaCheck className="text-sm" /> Approved
                  </button>
                ) : (
                  <button className="px-10 py-3 bg-[#FEF3E2] text-[#2952A1] rounded-xl font-bold cursor-default">
                    {appointment.status}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
