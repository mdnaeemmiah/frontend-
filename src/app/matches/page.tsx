/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

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

  useEffect(() => {
    // Get user's current location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
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
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchMatches();
    }
  }, [userLocation]);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      // Build query params
      const params = new URLSearchParams();
      if (userLocation) {
        params.append("latitude", userLocation.latitude.toString());
        params.append("longitude", userLocation.longitude.toString());
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_API || "https://practice-backend-oauth-image-video.vercel.app"
        }/api/patient/matches?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setMatches(result.data);

        // Fetch doctor details for each match
        const doctorPromises = result.data.map((match: MatchResult) =>
          fetch(
            `${process.env.NEXT_PUBLIC_BASE_API || ""}/api/doctor/${
              match.doctorId
            }`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ).then((res) => res.json())
        );

        const doctorResults = await Promise.all(doctorPromises);
        const doctorsMap: { [key: string]: Doctor } = {};

        doctorResults.forEach((res) => {
          if (res.success) {
            doctorsMap[res.data._id] = res.data;
          }
        });

        setDoctors(doctorsMap);
      } else {
        setError(result.message || "Failed to fetch matches");
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
      setError("Failed to fetch matches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="max-w-5xl mx-auto">
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
          <div className="space-y-8">
            {matches.map((match) => {
              const doctor = doctors[match.doctorId];
              if (!doctor) return null;

              return (
                <div
                  key={doctor._id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="p-8">
                    {/* Doctor Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-linear-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                          {doctor.profileImg ? (
                            <img
                              src={doctor.profileImg}
                              alt={doctor.name}
                              className="w-20 h-20 rounded-2xl object-cover"
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
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {doctor.name}
                          </h3>
                          <p className="text-lg text-gray-600 font-medium">
                            {doctor.specialization}
                          </p>
                          <div className="flex items-center mt-2 flex-wrap gap-2">
                            {doctor.rating && (
                              <div className="flex items-center">
                                <span className="text-yellow-400">★</span>
                                <span className="ml-1 text-sm text-gray-600 font-medium">
                                  {doctor.rating} ({doctor.reviewCount || 0}{" "}
                                  reviews)
                                </span>
                              </div>
                            )}
                            {doctor.experience && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm text-gray-600 font-medium">
                                  {doctor.experience} years exp.
                                </span>
                              </>
                            )}
                            {match.distance && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm text-[#2952a1] font-medium">
                                  📍 {match.distance.toFixed(1)} km away
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="bg-linear-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-xl text-lg font-bold shadow-lg">
                          {match.matchScore}% Match
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Perfect fit!
                        </p>
                      </div>
                    </div>

                    {/* Bio */}
                    {doctor.bio && (
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        {doctor.bio}
                      </p>
                    )}

                    {/* Match Reasons */}
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-3">
                        Why this is a great match:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {match.matchReasons.map((reason, idx) => (
                          <div
                            key={idx}
                            className="flex items-center text-gray-700 bg-green-50 p-3 rounded-lg"
                          >
                            <span className="text-green-500 mr-3">✓</span>
                            <span className="text-sm font-medium">
                              {reason}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {doctor.telehealth && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                          Virtual
                        </span>
                      )}
                      {doctor.inPerson && (
                        <span className="bg-[#ebe2cd] text-[#2952a1] px-3 py-1 rounded-full text-xs font-medium">
                          In-Person
                        </span>
                      )}
                      {doctor.languages?.map((lang) => (
                        <span
                          key={lang}
                          className="bg-[#ebe2cd] text-[#2952a1] px-3 py-1 rounded-full text-xs font-medium"
                        >
                          🗣️ {lang}
                        </span>
                      ))}
                      {doctor.vibeTags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          ✨ {tag}
                        </span>
                      ))}
                    </div>

                    {/* Chamber Location */}
                    {doctor.chamberLocation?.address && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          📍 Chamber Location:
                        </p>
                        <p className="text-sm text-gray-600">
                          {doctor.chamberLocation.address}
                        </p>
                        {(doctor.chamberLocation.city ||
                          doctor.chamberLocation.zipCode) && (
                          <p className="text-sm text-gray-600">
                            {doctor.chamberLocation.city}
                            {doctor.chamberLocation.city &&
                              doctor.chamberLocation.zipCode &&
                              ", "}
                            {doctor.chamberLocation.zipCode}
                          </p>
                        )}
                        {doctor.chamberLocation.googleMapsUrl && (
                          <a
                            href={doctor.chamberLocation.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#2952a1] hover:text-[#1e3d7a] font-medium mt-1 inline-block"
                          >
                            View on Google Maps →
                          </a>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      {doctor.introVideo && (
                        <a
                          href={doctor.introVideo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all text-center"
                        >
                          🎥 Watch Intro Video
                        </a>
                      )}
                      <button
                        onClick={() => handleSelectDoctor(doctor._id)}
                        className="flex-1 bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#1e3d7a] hover:to-[#2952a1] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        View Full Profile
                      </button>
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
