/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

export default function AdminPatients() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || "https://practice-backend-oauth-image-video.vercel.app"}/api/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        const patientUsers = result.data.filter(
          (user: any) => user.role === "patient"
        );
        setPatients(patientUsers);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-6">
        <input
          type="text"
          placeholder="Search patients by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <div
                key={patient._id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {patient.profilePicture && (
                      <img
                        src={patient.profilePicture}
                        alt={patient.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {patient.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            patient.isEmailVerified
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {patient.isEmailVerified ? "Verified" : "Unverified"}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p>
                          <span className="font-semibold">Email:</span>{" "}
                          {patient.email}
                        </p>
                        {patient.phone && (
                          <p>
                            <span className="font-semibold">Phone:</span>{" "}
                            {patient.phone}
                          </p>
                        )}
                        {patient.dateOfBirth && (
                          <p>
                            <span className="font-semibold">
                              Date of Birth:
                            </span>{" "}
                            {new Date(patient.dateOfBirth).toLocaleDateString()}
                          </p>
                        )}
                        {patient.address && (
                          <p>
                            <span className="font-semibold">Address:</span>{" "}
                            {patient.address}
                          </p>
                        )}
                        <p>
                          <span className="font-semibold">Joined:</span>{" "}
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {patient.medicalHistory &&
                        patient.medicalHistory.length > 0 && (
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-sm font-semibold text-blue-700 mb-1">
                              Medical History:
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
