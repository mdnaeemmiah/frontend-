/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";

// Static data
const STATIC_STATS = {
  todayAppointments: 5,
  totalAppointments: 48,
  totalPatients: 32,
  unreadMessages: 3,
};

const STATIC_APPOINTMENTS = [
  {
    _id: "1",
    patientName: "John Smith",
    appointmentDate: new Date().toISOString(),
    appointmentTime: "10:00 AM",
    status: "approved",
  },
  {
    _id: "2",
    patientName: "Emily Johnson",
    appointmentDate: new Date().toISOString(),
    appointmentTime: "11:30 AM",
    status: "approved",
  },
  {
    _id: "3",
    patientName: "Michael Brown",
    appointmentDate: new Date(Date.now() + 86400000).toISOString(),
    appointmentTime: "2:00 PM",
    status: "pending",
  },
  {
    _id: "4",
    patientName: "Sarah Davis",
    appointmentDate: new Date(Date.now() + 86400000).toISOString(),
    appointmentTime: "3:30 PM",
    status: "approved",
  },
  {
    _id: "5",
    patientName: "David Wilson",
    appointmentDate: new Date(Date.now() + 172800000).toISOString(),
    appointmentTime: "9:00 AM",
    status: "approved",
  },
];

export default function DoctorDashboard() {
  const [stats] = useState(STATIC_STATS);
  const [recentAppointments] = useState(STATIC_APPOINTMENTS);

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
      </div>
    </div>
  );
}
