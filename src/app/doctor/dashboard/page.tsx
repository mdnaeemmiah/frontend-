/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DoctorDashboard() {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalAppointments: 0,
    totalPatients: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      // Fetch appointments
      const appointmentsRes = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_API || "https://practice-backend-oauth-image-video.vercel.app"
        }/api/appointment/doctor-appointments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const appointments = await appointmentsRes.json();

      if (appointments.success) {
        const today = new Date().toDateString();
        const todayAppts = appointments.data.filter(
          (a: any) => new Date(a.appointmentDate).toDateString() === today
        );

        setStats({
          todayAppointments: todayAppts.length,
          totalAppointments: appointments.data.length,
          totalPatients: new Set(appointments.data.map((a: any) => a.patientId))
            .size,
          unreadMessages: 0,
        });

        setRecentAppointments(appointments.data.slice(0, 5));
      }

      // Fetch messages
      try {
        const messagesRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API || "https://practice-backend-oauth-image-video.vercel.app"}/api/message/my-messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const messages = await messagesRes.json();
        if (messages.success) {
          const unread = messages.data.filter((msg: any) => !msg.isRead).length;
          setStats((prev) => ({ ...prev, unreadMessages: unread }));
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#ebe2cd] rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#2952a1] rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] rounded-2xl p-8 text-white mb-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-2">
          Welcome to Your Dashboard 👋
        </h2>
        <p className="text-white/80">
          Here's what's happening with your practice today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#ebe2cd] rounded-lg flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {stats.todayAppointments}
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
            {stats.totalAppointments}
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
            {stats.totalPatients}
          </h3>
          <p className="text-gray-600">Total Patients</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {stats.unreadMessages}
          </h3>
          <p className="text-gray-600">New Messages</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/doctor/appointments"
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-[#ebe2cd] rounded-xl flex items-center justify-center">
              <span className="text-3xl">📅</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Appointments</h3>
              <p className="text-sm text-gray-600">View all appointments</p>
            </div>
          </div>
        </Link>

        <Link
          href="/doctor/profile"
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-[#ebe2cd] rounded-xl flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">My Profile</h3>
              <p className="text-sm text-gray-600">Update your profile</p>
            </div>
          </div>
        </Link>

        <Link
          href="/doctor/messages"
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-[#ebe2cd] rounded-xl flex items-center justify-center">
              <span className="text-3xl">💬</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Messages</h3>
              <p className="text-sm text-gray-600">
                {stats.unreadMessages > 0
                  ? `${stats.unreadMessages} unread`
                  : "No new messages"}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Recent Appointments
          </h3>
          <Link
            href="/doctor/appointments"
            className="text-[#2952a1] hover:text-[#1e3d7a] font-medium text-sm"
          >
            View All →
          </Link>
        </div>

        {recentAppointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No appointments yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentAppointments.map((appointment: any) => (
              <div
                key={appointment._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {appointment.patientName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(appointment.appointmentDate).toLocaleDateString()}{" "}
                    at {appointment.appointmentTime}
                  </p>
                </div>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
