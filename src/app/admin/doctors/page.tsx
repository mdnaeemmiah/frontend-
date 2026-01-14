/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

// Static doctors data
const STATIC_DOCTORS = [
  {
    _id: "doc_001",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@novahealth.com",
    phone: "+880 1712345678",
    specialization: "Cardiologist",
    experience: 12,
    location: "Dhaka, Bangladesh",
    bio: "Experienced cardiologist with 12+ years of practice. Specializes in preventive cardiology and patient education.",
    profilePicture: "https://i.pravatar.cc/150?img=1",
    status: "active",
  },
  {
    _id: "doc_002",
    name: "Dr. Michael Chen",
    email: "michael.chen@novahealth.com",
    phone: "+880 1823456789",
    specialization: "Orthopedic Surgeon",
    experience: 15,
    location: "Dhaka, Bangladesh",
    bio: "Specialized in orthopedic surgery with focus on joint replacement and sports medicine.",
    profilePicture: "https://i.pravatar.cc/150?img=2",
    status: "active",
  },
  {
    _id: "doc_003",
    name: "Dr. Emily Thompson",
    email: "emily.thompson@novahealth.com",
    phone: "+880 1934567890",
    specialization: "Family Medicine",
    experience: 8,
    location: "Dhaka, Bangladesh",
    bio: "Dedicated family medicine physician. Provides comprehensive healthcare for all age groups.",
    profilePicture: "https://i.pravatar.cc/150?img=3",
    status: "active",
  },
  {
    _id: "doc_004",
    name: "Dr. David Kumar",
    email: "david.kumar@novahealth.com",
    phone: "+880 1745678901",
    specialization: "Neurologist",
    experience: 11,
    location: "Dhaka, Bangladesh",
    bio: "Expert neurologist specializing in migraine management, epilepsy, and neurological disorders.",
    profilePicture: "https://i.pravatar.cc/150?img=4",
    status: "blocked",
  },
  {
    _id: "doc_005",
    name: "Dr. Amanda Rodriguez",
    email: "amanda.rodriguez@novahealth.com",
    phone: "+880 1856789012",
    specialization: "Dermatologist",
    experience: 9,
    location: "Dhaka, Bangladesh",
    bio: "Board-certified dermatologist specializing in medical and cosmetic dermatology.",
    profilePicture: "https://i.pravatar.cc/150?img=5",
    status: "active",
  },
];

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<any[]>(STATIC_DOCTORS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const handleStatusChange = (doctorId: string, newStatus: string) => {
    const updatedDoctors = doctors.map((doc) =>
      doc._id === doctorId ? { ...doc, status: newStatus } : doc
    );
    setDoctors(updatedDoctors);
    alert(`Doctor status updated to ${newStatus}`);
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" || doctor.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-sm font-semibold text-gray-700">Filter:</span>
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-[#2952a1] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({doctors.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "active"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Active ({doctors.filter((d) => d.status === "active").length})
          </button>
          <button
            onClick={() => setFilter("blocked")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "blocked"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Blocked ({doctors.filter((d) => d.status === "blocked").length})
          </button>
        </div>

        <input
          type="text"
          placeholder="Search doctors by name, specialization, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2952a1] focus:border-transparent"
        />
      </div>

      {/* Doctors List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            All Doctors ({filteredDoctors.length})
          </h2>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No doctors found</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {doctor.profilePicture && (
                      <img
                        src={doctor.profilePicture}
                        alt={doctor.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-[#2952a1]/20"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {doctor.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            doctor.status === "active"
                              ? "bg-green-100 text-green-700"
                              : doctor.status === "blocked"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {doctor.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p>
                          <span className="font-semibold">🩺 Specialization:</span>{" "}
                          {doctor.specialization}
                        </p>
                        <p>
                          <span className="font-semibold">📧 Email:</span>{" "}
                          {doctor.email}
                        </p>
                        {doctor.phone && (
                          <p>
                            <span className="font-semibold">📱 Phone:</span>{" "}
                            {doctor.phone}
                          </p>
                        )}
                        {doctor.location && (
                          <p>
                            <span className="font-semibold">📍 Location:</span>{" "}
                            {doctor.location}
                          </p>
                        )}
                        {doctor.experience && (
                          <p>
                            <span className="font-semibold">⏱️ Experience:</span>{" "}
                            {doctor.experience} years
                          </p>
                        )}
                      </div>

                      {doctor.bio && (
                        <p className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-200">
                          {doctor.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => {
                        alert(`Doctor ${doctor.name} approved successfully!`);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm whitespace-nowrap"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Are you sure you want to reject ${doctor.name}?`
                          )
                        ) {
                          alert(`Doctor ${doctor.name} rejected!`);
                        }
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm whitespace-nowrap"
                    >
                      ❌ Reject
                    </button>
                    {doctor.status !== "active" && (
                      <button
                        onClick={() => handleStatusChange(doctor._id, "active")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
                      >
                        🔓 Activate
                      </button>
                    )}
                    {doctor.status !== "blocked" && (
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to block this doctor?"
                            )
                          ) {
                            handleStatusChange(doctor._id, "blocked");
                          }
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors text-sm whitespace-nowrap"
                      >
                        🚫 Block
                      </button>
                    )}
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
