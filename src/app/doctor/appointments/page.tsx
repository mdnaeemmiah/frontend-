/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import { FaFilter, FaEnvelope, FaPhone, FaSearch, FaCalendarAlt, FaClock, FaCheck } from "react-icons/fa";
import img1 from "@/assets/img (1).png";
import img2 from "@/assets/img (2).png";
import img3 from "@/assets/img (3).png";
import img4 from "@/assets/img (4).png";

// Static appointments data
const STATIC_APPOINTMENTS = [
  {
    _id: "1",
    patientName: "Dr. Michael Chen",
    specialization: "Cardiologist",
    patientEmail: "michael@gmail.com",
    patientPhone: "01797642519",
    appointmentDate: "Today",
    appointmentTime: "2:30 PM",
    appointmentType: "Follow-up Visit",
    reason: "Routine cardiology check-up and blood pressure monitoring",
    status: "Approved",
    bookingId: "HC2024001",
    bookedDate: "Jan 15, 2024",
    adminNotes: "Patient requested afternoon slot",
    image: img1
  },
  {
    _id: "2",
    patientName: "Dr. Sarah Johnson",
    specialization: "Dermatologist",
    patientEmail: "sarah@gmail.com",
    patientPhone: "01797642519",
    appointmentDate: "Tomorrow",
    appointmentTime: "10:00 AM",
    appointmentType: "Consultation",
    reason: "Skin examination and mole assessment",
    status: "Pending",
    bookingId: "HC2024002",
    bookedDate: "Jan 20, 2024",
    adminNotes: "First-time patient consultation",
    image: img2
  },
  {
    _id: "3",
    patientName: "Dr. Robert Williams",
    specialization: "Orthopedic Surgeon",
    patientEmail: "robert@gmail.com",
    patientPhone: "01797642519",
    appointmentDate: "Jan 25, 2024",
    appointmentTime: "3:15 PM",
    appointmentType: "Surgery Follow-up",
    reason: "Post-operative knee surgery check-up",
    status: "Completed",
    bookingId: "HC2024003",
    bookedDate: "Jan 10, 2024",
    adminNotes: "Recovery progressing well",
    image: img3
  },
  {
    _id: "4",
    patientName: "Dr. Emily Davis",
    specialization: "General Practitioner",
    patientEmail: "emily@gmail.com",
    patientPhone: "01797642519",
    appointmentDate: "Feb 2, 2024",
    appointmentTime: "11:30 AM",
    appointmentType: "Annual Check-up",
    reason: "Annual physical examination and health screening",
    status: "Upcoming",
    bookingId: "HC2024004",
    bookedDate: "Jan 18, 2024",
    adminNotes: "Fasting required before visit",
    image: img4
  },
];

export default function DoctorAppointments() {
  const [appointments] = useState<any[]>(STATIC_APPOINTMENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || apt.status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-[#22C55E] text-white";
      case "pending":
        return "bg-[#F97316] text-white";
      case "completed":
        return "bg-[#0EA5E9] text-white";
      case "upcoming":
        return "bg-[#A855F7] text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#2952A1] p-6 md:p-8">
      {/* Page Heading */}
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">My Appointments</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-[20px] p-6 flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 bg-[#E0F2FE] rounded-[12px] flex items-center justify-center text-[#3B82F6]">
            <FaCalendarAlt className="text-2xl" />
          </div>
          <div>
            <p className="text-3xl font-bold text-[#1F2937]">5</p>
            <p className="text-sm font-medium text-gray-400">Today's Appointments</p>
          </div>
        </div>

        <div className="bg-white rounded-[20px] p-6 flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 bg-[#F5F3FF] rounded-[12px] flex items-center justify-center text-[#8B5CF6]">
            <FaClock className="text-2xl" />
          </div>
          <div>
            <p className="text-3xl font-bold text-[#1F2937]">2</p>
            <p className="text-sm font-medium text-gray-400">Upcoming</p>
          </div>
        </div>

        <div className="bg-white rounded-[20px] p-6 flex items-center gap-4 shadow-sm">
          <div className="w-14 h-14 bg-[#0052CC] rounded-[12px] flex items-center justify-center text-white">
            <FaCheck className="text-2xl" />
          </div>
          <div>
            <p className="text-3xl font-bold text-[#1F2937]">1</p>
            <p className="text-sm font-medium text-gray-400">Complete</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-[12px] text-gray-900 border-none focus:ring-0 shadow-sm font-medium"
          />
        </div>
        <button className="p-3 bg-white text-[#2952A1] rounded-[12px] shadow-sm hover:bg-gray-50 transition-all">
          <FaFilter className="text-xl" />
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment._id}
            className="bg-white rounded-[24px] p-6 shadow-md border border-gray-100"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                  <Image
                    src={appointment.image}
                    alt={appointment.patientName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1F2937] leading-tight flex items-center gap-2">
                    {appointment.patientName}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    {appointment.specialization}
                  </p>
                </div>
              </div>
              
              <div
                className={`px-6 py-2 rounded-[10px] text-sm font-bold flex items-center justify-center min-w-[100px] ${getStatusStyle(
                  appointment.status
                )}`}
              >
                {appointment.status}
              </div>
            </div>

            <p className="text-[#1F2937] font-medium mb-4">
              {appointment.appointmentDate}, {appointment.appointmentTime} • {appointment.appointmentType}
            </p>

            <div className="bg-[#EFF6FF] rounded-[16px] p-5 mb-4">
              <p className="text-sm font-bold text-[#1E40AF] mb-1">Reason for Visit</p>
              <p className="text-[#3B82F6] font-medium">
                {appointment.reason}
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-medium whitespace-nowrap">
                  Booked: {appointment.bookedDate} • Booking ID: #{appointment.bookingId}
                </p>
                {appointment.adminNotes && (
                  <p className="text-xs text-gray-400 font-medium">
                    Admin Notes: {appointment.adminNotes}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-6 text-gray-900 font-bold">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-gray-50 rounded-full"><FaEnvelope className="text-sm" /></span>
                  <span className="text-sm">{appointment.patientEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-gray-50 rounded-full"><FaPhone className="text-sm -rotate-90" /></span>
                  <span className="text-sm">{appointment.patientPhone}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <div className="text-center py-20 bg-white/10 rounded-[24px] border-2 border-dashed border-white/20">
            <p className="text-white text-xl font-medium">No appointments found</p>
          </div>
        )}
      </div>
    </div>
  );
}
