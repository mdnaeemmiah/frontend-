/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaFilter, FaEnvelope, FaPhone, FaSearch, FaCalendarAlt, FaClock, FaCheck, FaSpinner } from "react-icons/fa";
import baseApi from "@/api/baseAPi";
import { ENDPOINTS } from "@/api/endPoints";

// Types for API response
interface PatientInfo {
  name: string;
  email: string;
  phone: string;
  profile_picture: string;
}

interface DoctorInfo {
  name: string;
  specialty: string;
  email: string;
  phone: string;
  profile_picture: string;
}

interface AppointmentDetails {
  date: string;
  time: string;
  display: string;
  type: string;
}

interface Appointment {
  id: number;
  booking_id: string;
  patient_info: PatientInfo;
  doctor_info: DoctorInfo;
  appointment_details: AppointmentDetails;
  status: string;
  reason: string;
  message: string;
  contact_method: string;
  booked_date: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

interface Summary {
  my_appointments: number;
  todays_appointments: number;
  upcoming: number;
  completed: number;
}

interface ApiResponse {
  status: string;
  data: {
    summary: Summary;
    appointments: Appointment[];
  };
}

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [summary, setSummary] = useState<Summary>({
    my_appointments: 0,
    todays_appointments: 0,
    upcoming: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Fetch appointments data from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await baseApi.get<ApiResponse>(ENDPOINTS.doctor_appoinments);
        
        if (response.data.status === 'success') {
          setAppointments(response.data.data.appointments);
          setSummary(response.data.data.summary);
        } else {
          setError('Failed to fetch appointments data');
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = apt.patient_info.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.booking_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || apt.status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "confirmed":
        return "bg-[#22C55E] text-white";
      case "pending":
        return "bg-[#F97316] text-white";
      case "completed":
        return "bg-[#0EA5E9] text-white";
      case "upcoming":
        return "bg-[#A855F7] text-white";
      case "cancelled":
        return "bg-[#EF4444] text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#2952A1] p-6 md:p-8">
      {/* Page Heading */}
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">My Appointments</h1>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <FaSpinner className="animate-spin text-white text-4xl" />
          <span className="ml-4 text-white text-lg">Loading appointments...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-[16px] mb-6">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white rounded-[20px] p-6 flex items-center gap-4 shadow-sm">
              <div className="w-14 h-14 bg-[#E0F2FE] rounded-[12px] flex items-center justify-center text-[#3B82F6]">
                <FaCalendarAlt className="text-2xl" />
              </div>
              <div>
                <p className="text-3xl font-bold text-[#1F2937]">{summary.my_appointments}</p>
                <p className="text-sm font-medium text-gray-400">Total Appointments</p>
              </div>
            </div>

            <div className="bg-white rounded-[20px] p-6 flex items-center gap-4 shadow-sm">
              <div className="w-14 h-14 bg-[#FEF3C7] rounded-[12px] flex items-center justify-center text-[#F59E0B]">
                <FaCalendarAlt className="text-2xl" />
              </div>
              <div>
                <p className="text-3xl font-bold text-[#1F2937]">{summary.todays_appointments}</p>
                <p className="text-sm font-medium text-gray-400">Today's Appointments</p>
              </div>
            </div>

            <div className="bg-white rounded-[20px] p-6 flex items-center gap-4 shadow-sm">
              <div className="w-14 h-14 bg-[#F5F3FF] rounded-[12px] flex items-center justify-center text-[#8B5CF6]">
                <FaClock className="text-2xl" />
              </div>
              <div>
                <p className="text-3xl font-bold text-[#1F2937]">{summary.upcoming}</p>
                <p className="text-sm font-medium text-gray-400">Upcoming</p>
              </div>
            </div>

            <div className="bg-white rounded-[20px] p-6 flex items-center gap-4 shadow-sm">
              <div className="w-14 h-14 bg-[#0052CC] rounded-[12px] flex items-center justify-center text-white">
                <FaCheck className="text-2xl" />
              </div>
              <div>
                <p className="text-3xl font-bold text-[#1F2937]">{summary.completed}</p>
                <p className="text-sm font-medium text-gray-400">Completed</p>
              </div>
            </div>
          </div>

          {/* Search and Filter Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient name or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white rounded-[12px] text-gray-900 border-none focus:ring-0 shadow-sm font-medium"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-3 bg-white text-[#2952A1] rounded-[12px] shadow-sm hover:bg-gray-50 transition-all border-none focus:ring-0 font-medium"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="p-3 bg-white text-[#2952A1] rounded-[12px] shadow-sm hover:bg-gray-50 transition-all">
              <FaFilter className="text-xl" />
            </button>
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-[24px] p-6 shadow-md border border-gray-100"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    {/* <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                      <Image
                        src={appointment.patient_info.profile_picture}
                        alt={appointment.patient_info.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/default-avatar.png'; // fallback image
                        }}
                      />
                    </div> */}
                    <div>
                      <h3 className="text-xl font-bold text-[#1F2937] leading-tight flex items-center gap-2">
                        {appointment.patient_info.name}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium">
                        {appointment.booking_id}
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
                  {appointment.appointment_details.display} • {appointment.appointment_details.type}
                </p>

                <div className="bg-[#EFF6FF] rounded-[16px] p-5 mb-4">
                  <p className="text-sm font-bold text-[#1E40AF] mb-1">Reason for Visit</p>
                  <p className="text-[#3B82F6] font-medium">
                    {appointment.reason}
                  </p>
                  {appointment.message && (
                    <>
                      <p className="text-sm font-bold text-[#1E40AF] mb-1 mt-3">Message</p>
                      <p className="text-[#3B82F6] font-medium">
                        {appointment.message}
                      </p>
                    </>
                  )}
                </div>

                <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 font-medium whitespace-nowrap">
                      Booked: {appointment.booked_date} • Booking ID: {appointment.booking_id}
                    </p>
                    <p className="text-xs text-gray-400 font-medium">
                      Contact Method: {appointment.contact_method}
                    </p>
                    {appointment.admin_notes && (
                      <p className="text-xs text-gray-400 font-medium">
                        Admin Notes: {appointment.admin_notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-gray-900 font-bold">
                    <div className="flex items-center gap-2">
                      <span className="p-2 bg-gray-50 rounded-full"><FaEnvelope className="text-sm" /></span>
                      <span className="text-sm">{appointment.patient_info.email}</span>
                    </div>
                    {appointment.patient_info.phone && appointment.patient_info.phone !== "N/A" && (
                      <div className="flex items-center gap-2">
                        <span className="p-2 bg-gray-50 rounded-full"><FaPhone className="text-sm -rotate-90" /></span>
                        <span className="text-sm">{appointment.patient_info.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredAppointments.length === 0 && !loading && (
              <div className="text-center py-20 bg-white/10 rounded-[24px] border-2 border-dashed border-white/20">
                <p className="text-white text-xl font-medium">
                  {appointments.length === 0 ? "No appointments found" : "No appointments match your search criteria"}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
