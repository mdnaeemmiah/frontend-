/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaCheck, FaArrowRight } from "react-icons/fa";
import img1 from "@/assets/img (1).png";
import img2 from "@/assets/img (2).png";
import img3 from "@/assets/img (3).png";
import img4 from "@/assets/img (4).png";

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
    patientName: "John Smith",
    doctorName: "Dr. Sarah Johnson",
    appointmentDate: "1/22/2026",
    appointmentTime: "10.00 AM",
    status: "approved",
    image: img1
  },
  {
    _id: "apt_002",
    patientName: "Emily Johnson",
    doctorName: "Dr. Michael Chen",
    appointmentDate: "1/22/2026",
    appointmentTime: "11.30 AM",
    status: "approved",
    image: img2
  },
  {
    _id: "apt_003",
    patientName: "Michael Brown",
    doctorName: "Dr. Emily Thompson",
    appointmentDate: "1/23/2026",
    appointmentTime: "11.30 AM",
    status: "pending",
    image: img3
  },
  {
    _id: "apt_004",
    patientName: "Sarah Davis",
    doctorName: "Dr. David Kumar",
    appointmentDate: "1/23/2026",
    appointmentTime: "03.30 AM",
    status: "approved",
    image: img4
  },
  {
    _id: "apt_005",
    patientName: "David Wilson",
    doctorName: "Dr. Sarah Johnson",
    appointmentDate: "1/23/2026",
    appointmentTime: "09.30 AM",
    status: "approved",
    image: img2
  },
];

export default function AdminDashboard() {
  const [stats] = useState(STATIC_STATS);
  const [recentAppointments] = useState(STATIC_RECENT_APPOINTMENTS);

  return (
    <div>
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

        {recentAppointments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <p className="text-gray-500 font-medium">No appointments yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentAppointments.map((appointment: any) => (
              <div
                key={appointment._id}
                className="flex items-center justify-between p-2 bg-[#F9FAFB] hover:bg-gray-100 transition-colors rounded-[16px]"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <Image
                      src={appointment.image || img1}
                      alt={appointment.patientName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#1F2937] leading-tight">
                      {appointment.patientName}
                    </h4>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                      {appointment.appointmentDate} at {appointment.appointmentTime}
                    </p>
                  </div>
                </div>

                <div>
                  {appointment.status === "approved" ? (
                    <button className="flex items-center gap-2 bg-[#0052CC] text-white px-8 py-2.5 rounded-[10px] font-bold text-sm shadow-sm hover:bg-[#0041a3] transition-all">
                      <FaCheck className="text-xs" /> Approve
                    </button>
                  ) : (
                    <div className="bg-[#FEF3E2] text-[#B45309] px-8 py-2.5 rounded-[10px] font-bold text-sm flex items-center justify-center min-w-[124px]">
                      Pending
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
