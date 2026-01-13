/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const specializations = [
  "All Specializations",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "General Medicine",
  "Psychiatry",
  "Oncology",
];

export default function SearchDoctors() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useState({
    location: "",
    latitude: "",
    longitude: "",
    radius: "25",
    specialization: "",
    careMode: "both" as "in-person" | "virtual" | "both",
  });
  const [locationError, setLocationError] = useState("");

  const getCurrentLocation = () => {
    setLocationError("");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSearchParams({
            ...searchParams,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
            location: "Current Location",
          });
        },
        (error) => {
          setLocationError(
            "Unable to get your location. Please enter manually."
          );
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
    }
  };

  const searchDoctors = async () => {
    if (!searchParams.latitude || !searchParams.longitude) {
      alert("Please provide location coordinates");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        latitude: searchParams.latitude,
        longitude: searchParams.longitude,
        radius: searchParams.radius,
      });

      if (
        searchParams.specialization &&
        searchParams.specialization !== "All Specializations"
      ) {
        params.append("specialization", searchParams.specialization);
      }

      if (searchParams.careMode) {
        params.append("careMode", searchParams.careMode);
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_API || "https://practice-backend-oauth-image-video.vercel.app"
        }/api/doctor/search-by-location?${params}`
      );

      const result = await response.json();
      if (result.success) {
        setDoctors(result.data);
      } else {
        alert(result.message || "Failed to search doctors");
      }
    } catch (error) {
      console.error("Error searching doctors:", error);
      alert("Failed to search doctors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NovaHealth
              </span>
            </div>
            <button
              onClick={() => router.push("/")}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Find Doctors Near You
          </h1>
          <p className="text-gray-600">
            Search for healthcare providers based on your location and
            preferences
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Location */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchParams.location}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      location: e.target.value,
                    })
                  }
                  placeholder="Enter city or use current location"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={getCurrentLocation}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                >
                  📍 Use Current
                </button>
              </div>
              {locationError && (
                <p className="mt-2 text-sm text-red-600">{locationError}</p>
              )}
              {searchParams.latitude && (
                <p className="mt-2 text-sm text-green-600">
                  ✓ Location set: {parseFloat(searchParams.latitude).toFixed(4)}
                  , {parseFloat(searchParams.longitude).toFixed(4)}
                </p>
              )}
            </div>

            {/* Radius */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Radius (km)
              </label>
              <select
                value={searchParams.radius}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, radius: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
                <option value="100">100 km</option>
              </select>
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Specialization
              </label>
              <select
                value={searchParams.specialization}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    specialization: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Care Mode */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Care Mode
              </label>
              <select
                value={searchParams.careMode}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    careMode: e.target.value as any,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="both">Both In-Person & Virtual</option>
                <option value="in-person">In-Person Only</option>
                <option value="virtual">Virtual Only</option>
              </select>
            </div>

            {/* Manual Coordinates (Advanced) */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Latitude (Optional)
              </label>
              <input
                type="number"
                step="0.000001"
                value={searchParams.latitude}
                onChange={(e) =>
                  setSearchParams({ ...searchParams, latitude: e.target.value })
                }
                placeholder="40.7128"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="lg:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Longitude (Optional)
              </label>
              <input
                type="number"
                step="0.000001"
                value={searchParams.longitude}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    longitude: e.target.value,
                  })
                }
                placeholder="-74.0060"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={searchDoctors}
            disabled={
              loading || !searchParams.latitude || !searchParams.longitude
            }
            className="mt-6 w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "🔍 Search Doctors"}
          </button>
        </div>

        {/* Results */}
        {doctors.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Found {doctors.length} doctor{doctors.length !== 1 ? "s" : ""}{" "}
              near you
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  {/* Doctor Image */}
                  <div className="flex items-start mb-4">
                    <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4 shrink-0">
                      {doctor.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {doctor.specialization}
                      </p>
                      {doctor.distance && (
                        <p className="text-sm text-blue-600 font-medium mt-1">
                          📍 {doctor.distance} km away
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="space-y-2 mb-4">
                    {doctor.experience && (
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Experience:</span>{" "}
                        {doctor.experience} years
                      </p>
                    )}
                    {doctor.consultationFee && (
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Fee:</span> $
                        {doctor.consultationFee}
                      </p>
                    )}
                    {doctor.rating && (
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Rating:</span> ⭐{" "}
                        {doctor.rating}/5
                      </p>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {doctor.telehealth && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Virtual
                      </span>
                    )}
                    {doctor.inPerson && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        In-Person
                      </span>
                    )}
                    {doctor.acceptsNewPatients && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        Accepting New
                      </span>
                    )}
                  </div>

                  {/* Chamber Location */}
                  {doctor.chamberLocation?.address && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs font-semibold text-gray-700 mb-1">
                        Chamber Location:
                      </p>
                      <p className="text-xs text-gray-600">
                        {doctor.chamberLocation.address}
                      </p>
                      <p className="text-xs text-gray-600">
                        {doctor.chamberLocation.city},{" "}
                        {doctor.chamberLocation.zipCode}
                      </p>
                      {doctor.chamberLocation.googleMapsUrl && (
                        <a
                          href={doctor.chamberLocation.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-1 inline-block"
                        >
                          View on Google Maps →
                        </a>
                      )}
                    </div>
                  )}

                  {/* View Profile Button */}
                  <button
                    onClick={() => router.push(`/doctor/${doctor._id}`)}
                    className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && doctors.length === 0 && searchParams.latitude && (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-600 mb-6">
              Try increasing the search radius or adjusting your filters
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
