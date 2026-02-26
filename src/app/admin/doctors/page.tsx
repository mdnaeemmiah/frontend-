/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { getAdminAppointments, adminApproveStatus, Doctor, AdminAppointmentsResponse } from "@/service/adminService";

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

export default function AdminDoctors() {
  const [data, setData] = useState<AdminAppointmentsResponse>(DEFAULT_STATS as AdminAppointmentsResponse);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDoctorsData();
  }, []);

  useEffect(() => {
    let filtered = data.doctors;

    // Apply filter
    if (filter !== "all") {
      filtered = data.doctors.filter((doctor) => {
        switch(filter) {
          case "verified":
            return doctor.is_verified;
          case "pending":
            return !doctor.is_verified && doctor.verification_status === "pending";
          case "active":
            return doctor.is_active;
          case "rejected":
            return !doctor.is_verified && doctor.verification_status === "rejected";
          default:
            return true;
        }
      });
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter((doctor) =>
        doctor.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  }, [filter, data.doctors, searchTerm]);

  const fetchDoctorsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminAppointments();
      setData(response);
    } catch (err) {
      console.error("Error fetching doctors data:", err);
      setError("Failed to load doctors data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (doctorId: number, newStatus: string) => {
    try {
      await adminApproveStatus(doctorId, newStatus, "Status updated by admin");
      // Refresh the data after successful update
      await fetchDoctorsData();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-gray-500 mb-4">Loading doctors data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchDoctorsData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F2937] mb-2">
          Doctor Management
        </h1>
        <p className="text-gray-600">
          Manage doctors, verification status and access control
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👨‍⚕️</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{data.count}</h3>
          <p className="text-gray-600">Total Doctors</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{data.doctors.filter(d => d.is_verified).length}</h3>
          <p className="text-gray-600">Verified Doctors</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{data.doctors.filter(d => !d.is_verified && d.verification_status === 'pending').length}</h3>
          <p className="text-gray-600">Pending Verification</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🟢</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{data.doctors.filter(d => d.is_active).length}</h3>
          <p className="text-gray-600">Active Doctors</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-8">
        <div className="flex flex-wrap gap-4 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === "all"
                ? "bg-[#0052CC] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Doctors ({data.count})
          </button>
          <button
            onClick={() => setFilter("verified")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === "verified"
                ? "bg-[#0052CC] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Verified ({data.doctors.filter(d => d.is_verified).length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === "pending"
                ? "bg-[#0052CC] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending ({data.doctors.filter(d => !d.is_verified && d.verification_status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === "rejected"
                ? "bg-[#0052CC] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Rejected ({data.doctors.filter(d => !d.is_verified && d.verification_status === 'rejected').length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === "active"
                ? "bg-[#0052CC] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Active ({data.doctors.filter(d => d.is_active).length})
          </button>
        </div>

        <input
          type="text"
          placeholder="Search doctors by name, specialty, email or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
        />
      </div>

      {/* Doctors List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1F2937]">Doctors Management</h2>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-medium">No doctors found</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-100">
                      {doctor.profile_picture ? (
                        <img
                          src={doctor.profile_picture}
                          alt={doctor.user_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`${doctor.profile_picture ? 'hidden' : ''} w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs font-bold`}>
                        {doctor.user_name.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-[#1F2937]">{doctor.user_name}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            getVerificationBadge(doctor)
                          }`}
                        >
                          {getVerificationText(doctor)}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            doctor.is_active 
                              ? "bg-green-100 text-green-700" 
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {doctor.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <p>📧 {doctor.user_email}</p>
                        {doctor.specialty_name && <p>🏥 {doctor.specialty_name}</p>}
                        <p>💼 {doctor.years_of_experience} years experience</p>
                        {doctor.city && <p>📍 {doctor.city}</p>}
                        <p>🏥 Care Mode: {doctor.care_mode}</p>
                        <p>⭐ Rating: {doctor.average_rating.toFixed(1)} ({doctor.total_ratings} reviews)</p>
                        <p>🗓️ Joined: {new Date(doctor.created_at).toLocaleDateString()}</p>
                      </div>

                      {doctor.vibe_tags && doctor.vibe_tags.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-2">
                            {doctor.vibe_tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <select
                        value={getStatusFromDoctor(doctor)}
                        onChange={(e) => handleStatusUpdate(doctor.id, e.target.value)}
                        className={`px-3 py-1 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          getStatusFromDoctor(doctor) === 'approve' 
                            ? 'text-green-700 bg-green-50 border-green-300' 
                            : getStatusFromDoctor(doctor) === 'reject' 
                            ? 'text-red-700 bg-red-50 border-red-300' 
                            : 'text-yellow-700 bg-yellow-50 border-yellow-300'
                        }`}
                      >
                        <option value="pending" className="text-yellow-700">⏳ Pending</option>
                        <option value="approve" className="text-green-700">✅ Approve</option>
                        <option value="reject" className="text-red-700">❌ Reject</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
