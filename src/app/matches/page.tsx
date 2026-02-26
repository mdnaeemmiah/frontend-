/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { getAllDoctors } from "@/service/doctorService";

interface MatchResult {
  doctorId: string;
  matchScore: number;
  matchReasons: string[];
  distance?: number;
}

interface VibeTag {
  id: number;
  name: string;
  description: string | null;
}

interface Doctor {
  id: number;
  user: number;
  user_name: string;
  user_email: string;
  profile_picture: string;
  specialty: number | null;
  specialty_name?: string;
  credentials: string;
  care_mode: string;
  years_of_experience: number;
  city: string | null;
  vibe_tags: VibeTag[];
  is_active: boolean;
  is_verified: boolean;
  is_accepting_patients: boolean;
  average_rating: number;
  total_ratings: number;
  intro_video: string | null;
  created_at: string;
}

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [doctors, setDoctors] = useState<{ [key: string]: Doctor }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const fetchMatches = async () => {
    try {
      // Get data from /doctors/all/ API
      const response = await getAllDoctors();
      
      if (!response || !response.doctors) {
        console.error("Invalid response from API", response);
        setError("Unable to load doctors. Please try again.");
        setLoading(false);
        return;
      }

      const allDoctors = response.doctors || [];
      
      // Take only first 3 doctors
      const limitedDoctors = allDoctors.slice(0, 3);
      
      if (limitedDoctors.length === 0) {
        setMatches([]);
        setLoading(false);
        return;
      }

      const doctorsMap: { [key: string]: Doctor } = {};
      const matchResults: MatchResult[] = [];

      // Map doctors and create matches
      limitedDoctors.forEach((doctor: Doctor) => {
        doctorsMap[doctor.id.toString()] = doctor;

        // Calculate distance if user location is available
        let distance = undefined;
        if (userLocation) {
          distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            23.8103, // Default Dhaka latitude
            90.4125 // Default Dhaka longitude
          );
        }

        matchResults.push({
          doctorId: doctor.id.toString(),
          matchScore: doctor.average_rating ? Math.round(doctor.average_rating * 20) : 85,
          matchReasons: [
            `${doctor.years_of_experience}+ years of experience`,
            `Specializes in ${doctor.specialty_name || 'General Medicine'}`,
            `Rated ${doctor.average_rating || 5.0}/5 by patients`,
            doctor.care_mode === "virtual"
              ? "Offers virtual consultations"
              : "In-person consultation available",
          ],
          distance: distance,
        });
      });

      setDoctors(doctorsMap);
      setMatches(matchResults);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching matches:", error);
      setError(error?.message || "Failed to fetch matches. Please try again.");
      setLoading(false);
    }
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    const initializeMatches = async () => {
      // Get user's current location
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            fetchMatches();
          },
          (error) => {
            console.error("Geolocation error:", error);
            // Continue without location
            fetchMatches();
          }
        );
      } else {
        // Continue without location
        fetchMatches();
      }
    };

    initializeMatches();
  }, []);

  const handleSelectDoctor = (doctorId: string) => {
    // Navigate to public doctor profile page
    router.push(`/doctors/${doctorId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2952a1] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#ebe2cd] rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#2952a1] rounded-full animate-spin"></div>
          </div>
          <p className="text-xl text-gray-600 font-medium">
            Finding your perfect matches...
          </p>
          <p className="text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#2952a1] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/onboarding")}
            className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Complete Onboarding
          </button>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="min-h-screen bg-[#2952a1] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔍</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Matches Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find any doctors matching your preferences. Try updating
            your preferences or search manually.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push("/search-doctors")}
              className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Search Doctors Manually
            </button>
            <button
              onClick={() => router.push("/onboarding")}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Update Preferences
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-[#2952a1] py-12 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            {/* <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-flex items-center"
          >
            ← Back to Home
          </button> */}
            <h1 className="text-4xl font-bold text-white mb-4">
              Your Doctor Matches
            </h1>
            <p className="text-xl text-gray-200">
              We found{" "}
              <span className="text-green-500 font-semibold">
                {matches.length} doctor{matches.length !== 1 ? "s" : ""}
              </span>{" "}
              that perfectly match your preferences
            </p>
            {userLocation && (
              <p className="text-sm text-gray-100 mt-2">
                📍 Showing results near your location
              </p>
            )}
            <button
              onClick={() => router.push("/onboarding")}
              className="mt-4 text-white cursor-pointer font-medium text-sm inline-flex items-center"
            >
              ⚙️ Update Preferences
            </button>
          </div>

          {/* Matches */}
          <div className="space-y-4">
            {matches.map((match) => {
              const doctor = doctors[match.doctorId];
              if (!doctor) return null;

              return (
                <div
                  key={doctor.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 p-6"
                >
                  <div className="flex items-start gap-4">
                    {/* Doctor Image - Left Side */}
                    <div className="w-20 h-20 bg-linear-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center shadow-md overflow-hidden shrink-0">
                      {doctor.profile_picture ? (
                        <img
                          src={doctor.profile_picture}
                          alt={doctor.user_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-blue-600">
                          {doctor.user_name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </span>
                      )}
                    </div>

                    {/* Doctor Info - Middle */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {doctor.user_name}
                          </h3>
                          <p className="text-sm text-blue-600 font-medium">
                            {doctor.specialty_name || 'General Medicine'}
                          </p>
                        </div>
                        <div className="text-right">
                          {doctor.average_rating > 0 && (
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-yellow-400">★</span>
                              <span className="font-bold text-gray-900">
                                {doctor.average_rating.toFixed(1)}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({doctor.total_ratings || 0} reviews)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Vibe Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {doctor.vibe_tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag.id}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        {match.distance && (
                          <span className="flex items-center gap-1">
                            📍 {match.distance.toFixed(1)} miles away
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          ⏰ Available today
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        {doctor.intro_video && (
                          <button
                            onClick={() => {
                              const modal = document.createElement('div');
                              modal.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 cursor-pointer';
                              modal.onclick = (e) => {
                                if (e.target === modal) modal.remove();
                              };
                              modal.innerHTML = `
                                <div class="max-w-4xl w-full">
                                  <div class="flex justify-between items-center mb-4">
                                    <h2 class="text-2xl font-bold text-white">${doctor.user_name} - Intro Video</h2>
                                    <button class="text-white hover:text-gray-300 text-3xl" onclick="this.closest('.fixed').remove()">×</button>
                                  </div>
                                  <div class="bg-black rounded-2xl overflow-hidden">
                                    <video src="${doctor.intro_video}" controls autoplay class="w-full max-h-[70vh]"></video>
                                  </div>
                                </div>
                              `;
                              document.body.appendChild(modal);
                            }}
                            className="px-6 py-2 bg-[#2952a1] text-white rounded-lg font-semibold hover:bg-[#1e3d7a] transition-all flex items-center gap-2"
                          >
                            ▶ Watch Intro
                          </button>
                        )}
                        <button
                          onClick={() => handleSelectDoctor(doctor.id.toString())}
                          className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
                        >
                          👤 View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Browse More */}
          <div className="text-center mt-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Need more options?
              </h3>
              <p className="text-gray-600 mb-6">
                Browse our complete directory of healthcare providers in your
                area
              </p>
              <button
                onClick={() => router.push("/search-doctors")}
                className="bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] text-white px-8 py-3 rounded-xl font-semibold hover:from-[#1e3d7a] hover:to-[#2952a1] transition-all shadow-lg"
              >
                Search All Doctors →
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
