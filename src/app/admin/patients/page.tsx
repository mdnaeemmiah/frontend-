/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { getAdminPatients, Patient, AdminPatientsResponse } from "@/service/adminService";

// Default stats for loading
const DEFAULT_STATS = {
  count: 0,
  patients: []
};

export default function AdminPatients() {
  const [data, setData] = useState<AdminPatientsResponse>(DEFAULT_STATS as AdminPatientsResponse);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPatientsData();
  }, []);

  useEffect(() => {
    let filtered = data.patients;

    // Apply filter
    if (filter !== "all") {
      filtered = data.patients.filter((patient) => {
        switch(filter) {
          case "active":
            return patient.is_active;
          case "inactive":
            return !patient.is_active;
          case "verified":
            return patient.verification_status === "verified";
          case "unverified":
            return patient.verification_status === "unverified";
          case "with_preferences":
            return patient.has_preferences;
          default:
            return true;
        }
      });
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter((patient) =>
        patient.user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone_number?.includes(searchTerm)
      );
    }

    setFilteredPatients(filtered);
  }, [filter, data.patients, searchTerm]);

  const fetchPatientsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminPatients();
      setData(response);
    } catch (err) {
      console.error("Error fetching patients data:", err);
      setError("Failed to load patients data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getVerificationBadge = (patient: Patient) => {
    if (patient.verification_status === "verified") {
      return "bg-green-100 text-green-700";
    } else {
      return "bg-red-100 text-red-700";
    }
  };

  const getVerificationText = (patient: Patient) => {
    return patient.verification_status === "verified" ? "Verified" : "Unverified";
  };

  const getFullName = (patient: Patient) => {
    return `${patient.user.first_name} ${patient.user.last_name}`.trim();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-gray-500 mb-4">Loading patients data...</div>
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
            onClick={fetchPatientsData}
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
          Patient Management
        </h1>
        <p className="text-gray-600">
          Manage patients, verification status and account information
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{data.count}</h3>
          <p className="text-gray-600">Total Patients</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{data.patients.filter(p => p.verification_status === 'verified').length}</h3>
          <p className="text-gray-600">Verified Patients</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🟢</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{data.patients.filter(p => p.is_active).length}</h3>
          <p className="text-gray-600">Active Patients</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚙️</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{data.patients.filter(p => p.has_preferences).length}</h3>
          <p className="text-gray-600">With Preferences</p>
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
            All Patients ({data.count})
          </button>
          <button
            onClick={() => setFilter("verified")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === "verified"
                ? "bg-[#0052CC] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Verified ({data.patients.filter(p => p.verification_status === 'verified').length})
          </button>
          <button
            onClick={() => setFilter("unverified")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === "unverified"
                ? "bg-[#0052CC] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Unverified ({data.patients.filter(p => p.verification_status === 'unverified').length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === "active"
                ? "bg-[#0052CC] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Active ({data.patients.filter(p => p.is_active).length})
          </button>
          <button
            onClick={() => setFilter("with_preferences")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === "with_preferences"
                ? "bg-[#0052CC] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            With Preferences ({data.patients.filter(p => p.has_preferences).length})
          </button>
        </div>

        <input
          type="text"
          placeholder="Search patients by name, email, phone or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
        />
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#1F2937]">Patients Management</h2>
        </div>

        {filteredPatients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-medium">No patients found</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-200">
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-sm font-bold">
                        {patient.user.first_name?.charAt(0)?.toUpperCase() || 'P'}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-[#1F2937]">{getFullName(patient)}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            getVerificationBadge(patient)
                          }`}
                        >
                          {getVerificationText(patient)}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            patient.is_active 
                              ? "bg-green-100 text-green-700" 
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {patient.is_active ? "Active" : "Inactive"}
                        </span>
                        {patient.has_preferences && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                            Has Preferences
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <p>📧 {patient.user.email}</p>
                        {patient.phone_number && <p>📱 {patient.phone_number}</p>}
                        {patient.date_of_birth && <p>🎂 {new Date(patient.date_of_birth).toLocaleDateString()}</p>}
                        {patient.city && <p>📍 {patient.city}</p>}
                        {patient.country && <p>🌍 {patient.country}</p>}
                        {patient.zip_code && <p>📮 {patient.zip_code}</p>}
                        <p>🗓️ Joined: {new Date(patient.created_at).toLocaleDateString()}</p>
                        <p>🔄 Updated: {new Date(patient.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                        patient.verification_status === 'verified' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        ID: {patient.id}
                      </span>
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
