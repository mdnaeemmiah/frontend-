/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";

// Static data
const STATIC_STATS = {
  totalPatients: 156,
  totalDoctors: 24,
  totalAppointments: 342,
  pendingAppointments: 12,
};

const STATIC_RECENT_APPOINTMENTS = [
  {
    _id: "apt_001",
    patientName: "John Doe",
    doctorName: "Dr. Sarah Johnson",
    appointmentDate: "2026-01-20T10:00:00Z",
    appointmentTime: "10:00 AM",
    status: "pending",
  },
  {
    _id: "apt_002",
    patientName: "Jane Smith",
    doctorName: "Dr. Michael Chen",
    appointmentDate: "2026-01-18T14:30:00Z",
    appointmentTime: "02:30 PM",
    status: "approved",
  },
  {
    _id: "apt_003",
    patientName: "Robert Brown",
    doctorName: "Dr. Emily Thompson",
    appointmentDate: "2026-01-22T11:00:00Z",
    appointmentTime: "11:00 AM",
    status: "approved",
  },
  {
    _id: "apt_004",
    patientName: "Lisa Anderson",
    doctorName: "Dr. David Kumar",
    appointmentDate: "2026-01-16T09:00:00Z",
    appointmentTime: "09:00 AM",
    status: "rejected",
  },
  {
    _id: "apt_005",
    patientName: "Michael Wilson",
    doctorName: "Dr. Sarah Johnson",
    appointmentDate: "2026-01-25T15:00:00Z",
    appointmentTime: "03:00 PM",
    status: "pending",
  },
];

export default function AdminDashboard() {
  const [stats] = useState(STATIC_STATS);
  const [recentAppointments] = useState(STATIC_RECENT_APPOINTMENTS);

  return (
    <div>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] rounded-2xl p-8 text-white mb-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-2">
          Welcome to Admin Dashboard 🎯
        </h2>
        <p className="text-white/80">
          Manage your NovaHealth platform efficiently
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            <div className="w-12 h-12 bg-[#ebe2cd] rounded-lg flex items-center justify-center">
              <span className="text-2xl">👨‍⚕️</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {stats.totalDoctors}
          </h3>
          <p className="text-gray-600">Total Doctors</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">�</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {stats.totalAppointments}
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
            {stats.pendingAppointments}
          </h3>
          <p className="text-gray-600">Pending Approvals</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/admin/appointments"
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-[#ebe2cd] rounded-xl flex items-center justify-center">
              <span className="text-3xl">📅</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Appointments</h3>
              <p className="text-sm text-gray-600">Manage all appointments</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/doctors"
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-[#ebe2cd] rounded-xl flex items-center justify-center">
              <span className="text-3xl">👨‍⚕️</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Doctors</h3>
              <p className="text-sm text-gray-600">Manage doctor profiles</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/patients"
          className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-[#ebe2cd] rounded-xl flex items-center justify-center">
              <span className="text-3xl">👥</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Patients</h3>
              <p className="text-sm text-gray-600">Manage patient accounts</p>
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
            href="/admin/appointments"
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
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-semibold text-gray-900">
                      {appointment.patientName}
                    </p>
                    <span className="text-gray-400">→</span>
                    <p className="text-[#2952a1] font-medium">
                      {appointment.doctorName}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(appointment.appointmentDate).toLocaleDateString()}{" "}
                    at {appointment.appointmentTime}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    appointment.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : appointment.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : appointment.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
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
