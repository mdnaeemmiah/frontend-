/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaCheck, FaArrowRight } from "react-icons/fa";
import img1 from "@/assets/img (4).png";

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
    appointmentDate: "1/22/2026",
    appointmentTime: "10.00 AM",
    status: "approved",
    image: img1
  },
  {
    _id: "2",
    patientName: "Emily Johnson",
    appointmentDate: "1/22/2026",
    appointmentTime: "11.30 AM",
    status: "approved",
    image: img1
  },
  {
    _id: "3",
    patientName: "Michael Brown",
    appointmentDate: "1/23/2026",
    appointmentTime: "11.30 AM",
    status: "pending",
    image: img1
  },
  {
    _id: "4",
    patientName: "Sarah Davis",
    appointmentDate: "1/23/2026",
    appointmentTime: "03.30 AM",
    status: "approved",
    image: img1
  },
  {
    _id: "5",
    patientName: "David Wilson",
    appointmentDate: "1/23/2026",
    appointmentTime: "09.30 AM",
    status: "approved",
    image: img1
  },
];

export default function DoctorDashboard() {
  const [stats] = useState(STATIC_STATS);
  const [recentAppointments] = useState(STATIC_APPOINTMENTS);

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
          {recentAppointments.map((appointment: any) => (
            <div
              key={appointment._id}
              className="flex items-center justify-between p-2 bg-gray-100 hover:bg-gray-50/50 transition-all rounded-xl"
            >
              <div className="flex items-center gap-5">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                  <Image
                    src={appointment.image || img1}
                    alt={appointment.patientName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 leading-tight">
                    {appointment.patientName}
                  </h4>
                  <p className="text-sm text-gray-500 font-medium">
                    {appointment.appointmentDate} at {appointment.appointmentTime}
                  </p>
                </div>
              </div>
              
              {appointment.status === "approved" ? (
                <button className="flex items-center gap-2 px-8 py-3 bg-[#0052CC] text-white rounded-xl font-bold hover:bg-[#0747A6] transition-all shadow-sm cursor-pointer">
                  <FaCheck className="text-sm" /> Approve
                </button>
              ) : (
                <button className="px-10 py-3 bg-[#FEF3E2] text-[#2952A1] rounded-xl font-bold cursor-default">
                  Pending
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
