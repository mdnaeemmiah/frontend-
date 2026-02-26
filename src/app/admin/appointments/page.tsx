/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { getAdminAppointments, adminApproveStatus, getAdminAllAppointments, updateAppointmentStatus, Doctor, AdminAppointmentsResponse, AdminAllAppointmentsResponse, AdminAppointment } from "@/service/adminService";

// Add custom styles for animations
const customStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to { 
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  
  .animate-slideUp {
    animation: slideUp 0.4s ease-out;
  }
`;

// Inject styles
if (typeof window !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = customStyles;
  document.head.appendChild(styleElement);
}

// Default stats for loading
const DEFAULT_STATS = {
  count: 0,
  appointments: {
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0,
    total: 0
  },
  doctors: []
};

export default function AdminAppointments() {
  const [data, setData] = useState<AdminAppointmentsResponse>(DEFAULT_STATS as AdminAppointmentsResponse);
  const [appointmentsData, setAppointmentsData] = useState<AdminAllAppointmentsResponse | null>(null);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [filter, setFilter] = useState("all");
  const [appointmentFilter, setAppointmentFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AdminAppointment | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchAppointmentsData();
    fetchAllAppointments();
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilteredDoctors(data.doctors);
    } else {
      setFilteredDoctors(data.doctors.filter((doctor) => {
        switch(filter) {
          case "verified":
            return doctor.is_verified;
          case "pending":
            return !doctor.is_verified && doctor.verification_status === "pending";
          case "active":
            return doctor.is_active;
          default:
            return true;
        }
      }));
    }
  }, [filter, data.doctors]);

  const fetchAppointmentsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminAppointments();
      setData(response);
    } catch (err) {
      console.error("Error fetching appointments data:", err);
      setError("Failed to load appointments data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAppointments = async () => {
    try {
      const response = await getAdminAllAppointments();
      setAppointmentsData(response);
    } catch (err) {
      console.error("Error fetching all appointments:", err);
    }
  };

  const handleStatusUpdate = async (appointmentId: number, newStatus: string) => {
    try {
      const response = await updateAppointmentStatus(appointmentId, newStatus, "Status updated by admin");
      
      // Handle the API response
      if (response && response.appointment) {
        const updatedAppointment = response.appointment;
        
        // Update the selected appointment with the new status from API response
        if (selectedAppointment && selectedAppointment.id === appointmentId) {
          setSelectedAppointment({ 
            ...selectedAppointment, 
            status: updatedAppointment.new_status || newStatus 
          });
        }
      }
      
      // Refresh appointments data to get updated list
      await fetchAllAppointments();
      
    } catch (error) {
      console.error("Error updating appointment status:", error);
      alert("Failed to update appointment status. Please try again.");
    }
  };

  const openAppointmentPopup = (appointment: AdminAppointment) => {
    setSelectedAppointment(appointment);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedAppointment(null);
  };

  const getFilteredAppointments = () => {
    if (!appointmentsData) return [];
    
    if (appointmentFilter === "all") {
      return appointmentsData.appointments;
    }
    
    return appointmentsData.appointments.filter(appointment => {
      const status = appointment.status.toLowerCase();
      if (appointmentFilter === "approve") {
        return status === "approve" || status === "approved" || status === "scheduled" || status === "completed";
      }
      if (appointmentFilter === "reject") {
        return status === "reject" || status === "rejected" || status === "cancelled";
      }
      if (appointmentFilter === "block") {
        return status === "block" || status === "blocked";
      }
      return status === appointmentFilter.toLowerCase();
    });
  };

  // Helper function to normalize status for dropdown value
  const getDropdownValue = (status: string) => {
    const normalizedStatus = status?.toLowerCase() || '';
    if (normalizedStatus === 'pending') return 'pending';
    if (normalizedStatus.includes('approv') || normalizedStatus.includes('schedul') || normalizedStatus.includes('complet')) return 'approve';
    if (normalizedStatus.includes('reject') || normalizedStatus.includes('cancel')) return 'reject';
    if (normalizedStatus.includes('block')) return 'block';
    return 'pending'; // Default to pending
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-gradient-to-r from-[#FEF3E2] to-[#ebe2cd] text-[#FF6B4A] border-[#FF6B4A]';
      case 'approve': 
      case 'approved': return 'bg-gradient-to-r from-[#FEF3E2] to-[#ebe2cd] text-[#2952A1] border-[#2952A1]';
      case 'reject':
      case 'rejected': return 'bg-gradient-to-r from-red-50 to-red-100 text-[#FF6B4A] border-[#FF6B4A]';
      case 'block':
      case 'blocked': return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-500';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300';
    }
  };

  const getVerificationBadge = (doctor: Doctor) => {
    if (doctor.is_verified) {
      return "bg-green-100 text-green-700";
    } else if (doctor.verification_status === "pending") {
      return "bg-yellow-100 text-yellow-700";
    } else {
      return "bg-red-100 text-red-700";
    }
  };

  const getVerificationText = (doctor: Doctor) => {
    if (doctor.is_verified) {
      return "Verified";
    } else if (doctor.verification_status === "pending") {
      return "Pending";
    } else {
      return "Rejected";
    }
  };

  const handleDoctorStatusUpdate = async (doctorId: number, newStatus: string) => {
    try {
      await adminApproveStatus(doctorId, newStatus, "Status updated by admin");
      // Refresh the data after successful update
      await fetchAppointmentsData();
    } catch (error) {
      console.error("Error updating doctor status:", error);
      alert("Failed to update doctor status. Please try again.");
    }
  };

  const getStatusFromDoctor = (doctor: Doctor) => {
    if (doctor.is_verified) {
      return "approve";
    } else if (doctor.verification_status === "pending") {
      return "pending";
    } else {
      return "reject";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-gray-500 mb-4">Loading appointments data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[#FF6B4A] mb-4">{error}</p>
          <button 
            onClick={fetchAppointmentsData}
            className="px-4 py-2 bg-[#2952A1] text-white rounded-lg hover:bg-[#1e3d7a]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">




      {/* Appointments Statistics */}
      {appointmentsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl text-white">📋</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {appointmentsData.count}
            </h3>
            <p className="text-gray-600">Total Appointments</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl text-white">⏳</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {appointmentsData.status_statistics.pending}
            </h3>
            <p className="text-gray-600">Pending Review</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl text-white">✅</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {(appointmentsData.status_statistics.scheduled || 0) + (appointmentsData.status_statistics.completed || 0)}
            </h3>
            <p className="text-gray-600">Approved</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl text-white">❌</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {appointmentsData.status_statistics.cancelled || 0}
            </h3>
            <p className="text-gray-600">Rejected</p>
          </div>
        </div>
      )}

      {/* Appointments Filter Tabs */}
      {appointmentsData && (
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">📋 Appointment Management</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-[#2952A1] rounded-full animate-pulse"></span>
              <span>Live Updates</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setAppointmentFilter("all")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                appointmentFilter === "all"
                  ? "bg-gradient-to-r from-[#2952A1] to-[#1e3d7a] text-white shadow-lg scale-105"
                  : "bg-[#FEF3E2] text-[#2952A1] hover:bg-[#ebe2cd] hover:shadow-md border border-[#2952A1]"
              }`}
            >
              🔍 All
            </button>
            <button
              onClick={() => setAppointmentFilter("pending")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                appointmentFilter === "pending"
                  ? "bg-gradient-to-r from-[#FF6B4A] to-[#FF5533] text-white shadow-lg scale-105"
                  : "bg-[#FEF3E2] text-[#FF6B4A] hover:bg-[#ebe2cd] hover:shadow-md border border-[#FF6B4A]"
              }`}
            >
              ⏳ Pending 
            </button>
            <button
              onClick={() => setAppointmentFilter("approve")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                appointmentFilter === "approve"
                  ? "bg-gradient-to-r from-[#2952A1] to-[#1e3d7a] text-white shadow-lg scale-105"
                  : "bg-[#FEF3E2] text-[#2952A1] hover:bg-[#ebe2cd] hover:shadow-md border border-[#2952A1]"
              }`}
            >
              ✅ Approved 
            </button>
            <button
              onClick={() => setAppointmentFilter("reject")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                appointmentFilter === "reject"
                  ? "bg-gradient-to-r from-[#FF6B4A] to-[#FF5533] text-white shadow-lg scale-105"
                  : "bg-[#FEF3E2] text-[#FF6B4A] hover:bg-[#ebe2cd] hover:shadow-md border border-[#FF6B4A]"
              }`}
            >
              ❌ Rejected 
            </button>
            <button
              onClick={() => setAppointmentFilter("block")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                appointmentFilter === "block"
                  ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md border border-gray-400"
              }`}
            >
              🚫 Blocked 
            </button>
          </div>
        </div>
      )}

      {/* Appointments List */}
      {appointmentsData && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-[#FEF3E2] to-[#ebe2cd] p-6 border-b border-[#2952A1]">
            <h2 className="text-2xl font-bold text-[#2952A1] flex items-center">
              <span className="mr-3">📊</span>
              Appointments Overview
              <span className="ml-4 px-3 py-1 text-sm bg-[#2952A1] text-white rounded-full font-medium">
                {getFilteredAppointments().length} {appointmentFilter === "all" ? "Total" : appointmentFilter === "pending" ? "Pending" : appointmentFilter === "approve" ? "Approved" : appointmentFilter === "reject" ? "Rejected" : "Blocked"}
              </span>
            </h2>
          </div>

          <div className="p-6 space-y-4">
            {getFilteredAppointments().length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl text-gray-400">📋</span>
                </div>
                <p className="text-gray-500 font-medium text-lg">No appointments found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              getFilteredAppointments().map((appointment) => (
                <div key={appointment.id} className="group bg-gradient-to-r from-[#FEF3E2] to-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-[#ebe2cd] hover:border-[#2952A1] transform hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="relative flex-shrink-0">
                        <img
                          src={appointment.patient_info.profile_picture}
                          alt={appointment.patient_info.name}
                          className="w-14 h-14 rounded-full object-cover ring-3 ring-white shadow-md"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/api/placeholder/56/56';
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#2952A1] rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#2952A1] transition-colors">
                            {appointment.booking_id}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(appointment.status)} shadow-sm`}>
                            {appointment.status === "Pending" ? "⏳ Pending" : appointment.status.toLowerCase().includes("approv") || appointment.status.toLowerCase().includes("schedul") || appointment.status.toLowerCase().includes("complet") ? "✅ Approved" : appointment.status.toLowerCase().includes("reject") || appointment.status.toLowerCase().includes("cancel") ? "❌ Rejected" : appointment.status}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-700 font-medium flex items-center">
                            <span className="mr-2">👤</span>
                            {appointment.patient_info.name} 
                            <span className="mx-2 text-[#FF6B4A]">→</span>
                            <span className="text-[#2952A1] font-semibold">{appointment.doctor_info.name}</span>
                          </p>
                          <p className="text-gray-500 text-sm flex items-center">
                            <span className="mr-2">📅</span>
                            {appointment.appointment_details.display}
                          </p>
                          <p className="text-gray-500 text-xs flex items-center">
                            <span className="mr-2">🏥</span>
                            {appointment.appointment_details.type} • {appointment.doctor_info.specialty}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => openAppointmentPopup(appointment)}
                      className="group/btn p-3 bg-gradient-to-r from-[#2952A1] to-[#1e3d7a] hover:from-[#1e3d7a] hover:to-[#2952A1] rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
                      title="View Full Details"
                    >
                      <svg className="w-6 h-6 text-white group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}



      {/* Enhanced Appointment Details Popup */}
      {showPopup && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl transform animate-slideUp">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#2952A1] to-[#1e3d7a] p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Appointment Details</h2>
                    <p className="text-[#FEF3E2] text-sm">{selectedAppointment.booking_id}</p>
                  </div>
                </div>
                <button
                  onClick={closePopup}
                  className="p-2 hover:bg-orange-600 hover:bg-opacity-20 rounded-full transition-all duration-300 group"
                >
                  <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 max-h-[calc(95vh-120px)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Patient Information */}
                <div className="bg-gradient-to-br from-[#FEF3E2] to-[#ebe2cd] rounded-2xl p-6 border border-[#2952A1]">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">👤</span>
                    <h3 className="text-xl font-bold text-[#2952A1]">Patient Information</h3>
                  </div>
                  <div className="flex items-center space-x-4 mb-6">
                    <img
                      src={selectedAppointment.patient_info.profile_picture}
                      alt={selectedAppointment.patient_info.name}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg"
                    />
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-900 text-lg">{selectedAppointment.patient_info.name}</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-700 flex items-center">
                          <span className="w-4 h-4 mr-2">📧</span>
                          {selectedAppointment.patient_info.email}
                        </p>
                        <p className="text-sm text-gray-700 flex items-center">
                          <span className="w-4 h-4 mr-2">📱</span>
                          {selectedAppointment.patient_info.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Doctor Information */}
                <div className="bg-gradient-to-br from-[#FEF3E2] to-[#ebe2cd] rounded-2xl p-6 border border-[#2952A1]">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">👨‍⚕️</span>
                    <h3 className="text-xl font-bold text-[#2952A1]">Doctor Information</h3>
                  </div>
                  <div className="flex items-center space-x-4 mb-6">
                    <img
                      src={selectedAppointment.doctor_info.profile_picture}
                      alt={selectedAppointment.doctor_info.name}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg"
                    />
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-900 text-lg">{selectedAppointment.doctor_info.name}</h4>
                      <p className="text-sm font-medium text-green-700">{selectedAppointment.doctor_info.specialty}</p>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-700 flex items-center">
                          <span className="w-4 h-4 mr-2">📧</span>
                          {selectedAppointment.doctor_info.email}
                        </p>
                        <p className="text-sm text-gray-700 flex items-center">
                          <span className="w-4 h-4 mr-2">📱</span>
                          {selectedAppointment.doctor_info.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="bg-gradient-to-br from-[#FEF3E2] to-[#ebe2cd] rounded-2xl p-6 border border-[#2952A1]">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">📅</span>
                    <h3 className="text-xl font-bold text-[#2952A1]">Appointment Details</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-600">Booking ID</p>
                      <p className="font-semibold text-gray-900">{selectedAppointment.booking_id}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-600">Date & Time</p>
                      <p className="font-semibold text-gray-900">{selectedAppointment.appointment_details.display}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-600">Type</p>
                      <p className="font-semibold text-gray-900">{selectedAppointment.appointment_details.type}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-600">Contact Method</p>
                      <p className="font-semibold text-gray-900">{selectedAppointment.contact_method}</p>
                    </div>
                  </div>
                </div>

                {/* Status & Admin Controls */}
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">⚙️</span>
                    <h3 className="text-xl font-bold text-amber-900">Admin Controls</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-gray-700">Current Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(selectedAppointment.status)}`}>
                          {selectedAppointment.status}
                        </span>
                      </div>
                      <select
                        value={getDropdownValue(selectedAppointment.status)}
                        onChange={(e) => {
                          const newStatus = e.target.value; // Send the exact API value
                          handleStatusUpdate(selectedAppointment.id, newStatus);
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-[#2952A1] focus:border-[#2952A1] transition-all font-semibold"
                      >
                        <option value="pending" className="font-semibold">⏳ Pending Review</option>
                        <option value="approve" className="font-semibold">✅ Approve Appointment</option>
                        <option value="reject" className="font-semibold">❌ Reject Appointment</option>
                        <option value="block" className="font-semibold">🚫 Block Appointment</option>
                      </select>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-600 mb-1">Reason for Appointment</p>
                        <p className="text-gray-900">{selectedAppointment.reason}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-600 mb-1">Patient Message</p>
                        <p className="text-gray-900">{selectedAppointment.message}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-600 mb-1">Admin Notes</p>
                        <p className="text-gray-900">{selectedAppointment.admin_notes}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={closePopup}
                  className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
