/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { getDoctorsFromAssets } from "@/service/matchService";

interface MatchResult {
  doctorId: string;
  matchScore: number;
  matchReasons: string[];
  distance?: number;
}

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  profileImg?: string;
  errorImg?: string;
  introVideo?: string;
  bio?: string;
  languages: string[];
  vibeTags: string[];
  rating?: number;
  reviewCount?: number;
  experience?: number;
  consultationFee?: number;
  city?: string;
  chamberLocation?: {
    address: string;
    city: string;
    zipCode: string;
    googleMapsUrl?: string;
  };
  telehealth?: boolean;
  inPerson?: boolean;
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
      // Get local data from assets
      const allDoctors = getDoctorsFromAssets();
      const doctorsMap: { [key: string]: Doctor } = {};
      const matchResults: MatchResult[] = [];

      // Map doctors and create matches
      allDoctors.forEach((doctor) => {
        doctorsMap[doctor._id] = doctor;

        // Calculate distance if user location is available
        let distance = undefined;
        if (userLocation) {
          distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            20.5937, // Default Dhaka latitude
            88.9629 // Default Dhaka longitude
          );
        }

        matchResults.push({
          doctorId: doctor._id,
          matchScore: doctor.rating ? Math.round(doctor.rating * 20) : 85,
          matchReasons: [
            `${doctor.experience || 5}+ years of experience`,
            `Specializes in ${doctor.specialization}`,
            `Rated ${doctor.rating || 4.5}/5 by patients`,
            doctor.telehealth
              ? "Offers virtual consultations"
              : "In-person consultation available",
          ],
          distance: distance,
        });
      });

      setDoctors(doctorsMap);
      setMatches(matchResults);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setError("Failed to fetch matches. Please try again.");
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
      <div className="min-h-screen bg-gradient-to-br from-[#ebe2cd] via-white to-[#ebe2cd]/50 flex items-center justify-center">
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
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
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
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
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
      <div className="min-h-screen bg-gradient-to-br from-[#ebe2cd] via-white to-[#ebe2cd]/50 py-12 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            {/* <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-flex items-center"
          >
            ← Back to Home
          </button> */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Doctor Matches
            </h1>
            <p className="text-xl text-gray-600">
              We found{" "}
              <span className="text-[#2952a1] font-semibold">
                {matches.length} doctor{matches.length !== 1 ? "s" : ""}
              </span>{" "}
              that perfectly match your preferences
            </p>
            {userLocation && (
              <p className="text-sm text-gray-500 mt-2">
                📍 Showing results near your location
              </p>
            )}
            <button
              onClick={() => router.push("/onboarding")}
              className="mt-4 text-[#2952a1] hover:text-[#1e3d7a] font-medium text-sm inline-flex items-center"
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
                  key={doctor._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 p-6"
                >
                  <div className="flex items-start gap-4">
                    {/* Doctor Image - Left Side */}
                    <div className="w-20 h-20 bg-linear-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center shadow-md overflow-hidden flex-shrink-0">
                      {doctor.profileImg ? (
                        <img
                          src={doctor.profileImg}
                          alt={doctor.name}
                          className="w-20 h-20 object-cover"
                          onError={(e) => {
                            if (doctor.errorImg) {
                              e.currentTarget.src = doctor.errorImg;
                            }
                          }}
                        />
                      ) : doctor.errorImg ? (
                        <img
                          src={doctor.errorImg}
                          alt={doctor.name}
                          className="w-20 h-20 object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-blue-600">
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      )}
                    </div>

                    {/* Doctor Info - Middle */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {doctor.name}
                          </h3>
                          <p className="text-sm text-blue-600 font-medium">
                            {doctor.specialization}
                          </p>
                        </div>
                        <div className="text-right">
                          {doctor.rating && (
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-yellow-400">★</span>
                              <span className="font-bold text-gray-900">
                                {doctor.rating}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({doctor.reviewCount || 0} reviews)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Vibe Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {doctor.vibeTags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"
                          >
                            {tag}
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
                        {doctor.introVideo && (
                          <button
                            onClick={() => {
                              const modal = document.createElement('div');
                              modal.className = 'fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4';
                              modal.innerHTML = `
                                <div class="max-w-4xl w-full">
                                  <div class="flex justify-between items-center mb-4">
                                    <h2 class="text-2xl font-bold text-white">${doctor.name} - Intro Video</h2>
                                    <button class="text-white hover:text-gray-300 text-3xl" onclick="this.closest('div').remove()">×</button>
                                  </div>
                                  <div class="bg-black rounded-2xl overflow-hidden">
                                    <video src="${doctor.introVideo}" controls autoplay class="w-full max-h-[70vh]"></video>
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
                          onClick={() => handleSelectDoctor(doctor._id)}
                          className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
                        >
                          � View Profile
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
