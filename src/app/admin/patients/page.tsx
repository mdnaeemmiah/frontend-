/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

// Static patients data
const STATIC_PATIENTS = [
  {
    _id: "pat_001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+880 1712345678",
    dateOfBirth: "1990-05-15",
    address: "House 45, Road 12, Block C, Dhaka",
    profilePicture: "https://i.pravatar.cc/150?img=12",
    isEmailVerified: true,
    createdAt: "2025-01-01T00:00:00Z",
    medicalHistory: ["Hypertension", "Type 2 Diabetes"],
  },
  {
    _id: "pat_002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+880 1823456789",
    dateOfBirth: "1985-08-22",
    address: "Apartment 7B, Banani, Dhaka",
    profilePicture: "https://i.pravatar.cc/150?img=10",
    isEmailVerified: true,
    createdAt: "2025-01-05T00:00:00Z",
    medicalHistory: ["Asthma"],
  },
  {
    _id: "pat_003",
    name: "Robert Brown",
    email: "robert.brown@example.com",
    phone: "+880 1934567890",
    dateOfBirth: "1978-03-10",
    address: "House 23, Gulshan Avenue, Dhaka",
    profilePicture: "https://i.pravatar.cc/150?img=13",
    isEmailVerified: false,
    createdAt: "2025-01-08T00:00:00Z",
    medicalHistory: [],
  },
  {
    _id: "pat_004",
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    phone: "+880 1745678901",
    dateOfBirth: "1995-11-30",
    address: "Flat 5C, Dhanmondi, Dhaka",
    profilePicture: "https://i.pravatar.cc/150?img=9",
    isEmailVerified: true,
    createdAt: "2025-01-10T00:00:00Z",
    medicalHistory: ["Migraine", "Anxiety"],
  },
  {
    _id: "pat_005",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    phone: "+880 1856789012",
    dateOfBirth: "1982-07-18",
    address: "House 89, Mirpur, Dhaka",
    profilePicture: "https://i.pravatar.cc/150?img=14",
    isEmailVerified: true,
    createdAt: "2025-01-12T00:00:00Z",
    medicalHistory: ["High Cholesterol"],
  },
];

export default function AdminPatients() {
  const [patients] = useState<any[]>(STATIC_PATIENTS);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Search Bar */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-6">
        <input
          type="text"
          placeholder="Search patients by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2952a1] focus:border-transparent"
        />
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            All Patients ({filteredPatients.length})
          </h2>
        </div>

        {filteredPatients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No patients found</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {filteredPatients.map((patient) => (
              <div
                key={patient._id}
                className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {patient.profilePicture && (
                      <img
                        src={patient.profilePicture}
                        alt={patient.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-[#2952a1]/20"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {patient.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            patient.isEmailVerified
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {patient.isEmailVerified ? "✓ Verified" : "⚠ Unverified"}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p>
                          <span className="font-semibold">📧 Email:</span>{" "}
                          {patient.email}
                        </p>
                        {patient.phone && (
                          <p>
                            <span className="font-semibold">📱 Phone:</span>{" "}
                            {patient.phone}
                          </p>
                        )}
                        {patient.dateOfBirth && (
                          <p>
                            <span className="font-semibold">🎂 Date of Birth:</span>{" "}
                            {new Date(patient.dateOfBirth).toLocaleDateString()}
                          </p>
                        )}
                        {patient.address && (
                          <p>
                            <span className="font-semibold">📍 Address:</span>{" "}
                            {patient.address}
                          </p>
                        )}
                        <p>
                          <span className="font-semibold">📅 Joined:</span>{" "}
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {patient.medicalHistory &&
                        patient.medicalHistory.length > 0 && (
                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                            <p className="text-sm font-semibold text-blue-700 mb-1">
                              🏥 Medical History:
                            </p>
                            <ul className="text-sm text-blue-700 list-disc list-inside">
                              {patient.medicalHistory.map(
                                (item: string, index: number) => (
                                  <li key={index}>{item}</li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => {
                        alert(`Viewing details for ${patient.name}`);
                      }}
                      className="px-4 py-2 bg-[#2952a1] text-white rounded-lg font-medium hover:bg-[#1e3d7a] transition-colors text-sm whitespace-nowrap"
                    >
                      👁️ View Details
                    </button>
                    <button
                      onClick={() => {
                        alert(`Sending message to ${patient.name}`);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm whitespace-nowrap"
                    >
                      💬 Message
                    </button>
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
