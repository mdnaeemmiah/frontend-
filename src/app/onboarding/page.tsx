/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    careType: "",
    careMode: "",
    location: {
      latitude: 0,
      longitude: 0,
      radius: 5, // Default 5km
      address: "",
    },
    communicationStyle: "",
    availabilityPreferences: {
      weekendAvailability: false,
      eveningAppointments: false,
      urgentCare: false,
    },
    languagePreferences: [] as string[],
    insuranceProvider: "",
    vibePreferences: [] as string[],
  });

  useEffect(() => {
    checkExistingProfile();
  }, []);

  const checkExistingProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || "https://practice-backend-oauth-image-video.vercel.app"}/api/patient/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success && result.data) {
        // Profile exists - load it and mark as updating
        setIsUpdating(true);
        const prefs = result.data.preferences;
        setFormData({
          careType: prefs.careType || "",
          careMode: prefs.careMode || "",
          location: prefs.location || {
            latitude: 0,
            longitude: 0,
            radius: 5,
            address: "",
          },
          communicationStyle: prefs.communicationStyle || "",
          availabilityPreferences: prefs.availabilityPreferences || {
            weekendAvailability: false,
            eveningAppointments: false,
            urgentCare: false,
          },
          languagePreferences: prefs.languagePreferences || [],
          insuranceProvider: prefs.insuranceProvider || "",
          vibePreferences: prefs.vibePreferences || [],
        });
      }
    } catch (error) {
      console.error("Error checking profile:", error);
    } finally {
      setCheckingProfile(false);
    }
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            location: {
              ...formData.location,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              address: "Current Location",
            },
          });
        },
        (error) => {
          alert("Unable to get your location. Please try again.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || "https://practice-backend-oauth-image-video.vercel.app"}/api/patient/profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (result.success) {
        router.push("/matches");
      } else {
        alert(result.message || "Failed to save preferences");
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  if (checkingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#ebe2cd] via-white to-[#ebe2cd]/50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#ebe2cd] rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#2952a1] rounded-full animate-spin"></div>
          </div>
          <p className="text-xl text-gray-600 font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-[#ebe2cd] via-white to-[#ebe2cd]/50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {isUpdating
                      ? "Update Your Preferences"
                      : "Find Your Perfect Doctor"}
                  </h1>
                  {isUpdating && (
                    <p className="text-sm text-gray-600 mt-1">
                      Update your preferences to get new doctor matches
                    </p>
                  )}
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full font-medium">
                  Step {step} of {totalSteps}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: Care Type & Mode */}
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    What type of care do you need?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        value: "primary-care",
                        label: "Primary Care",
                        icon: "🏥",
                      },
                      { value: "ob-gyn", label: "OB-GYN", icon: "👶" },
                      {
                        value: "mental-health",
                        label: "Mental Health",
                        icon: "🧠",
                      },
                      {
                        value: "dermatology",
                        label: "Dermatology",
                        icon: "✨",
                      },
                      { value: "cardiology", label: "Cardiology", icon: "❤️" },
                      { value: "other", label: "Other", icon: "🔍" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, careType: option.value })
                        }
                        className={`flex items-center p-6 border-2 rounded-xl transition-all duration-200 ${
                          formData.careType === option.value
                            ? "border-[#2952a1] bg-[#ebe2cd]/30"
                            : "border-gray-200 hover:border-[#2952a1]/50 hover:bg-[#ebe2cd]/20"
                        }`}
                      >
                        <span className="text-3xl mr-4">{option.icon}</span>
                        <span className="text-lg font-medium text-gray-900">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    How would you like to receive care?
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        value: "in-person",
                        label: "In-person visits only",
                        desc: "Traditional office visits",
                      },
                      {
                        value: "virtual",
                        label: "Virtual appointments only",
                        desc: "Online consultations from home",
                      },
                      {
                        value: "both",
                        label: "Both in-person and virtual",
                        desc: "Flexible care options",
                      },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, careMode: option.value })
                        }
                        className={`w-full flex items-start p-4 border-2 rounded-xl transition-all duration-200 text-left ${
                          formData.careMode === option.value
                            ? "border-[#2952a1] bg-[#ebe2cd]/30"
                            : "border-gray-200 hover:border-[#2952a1]/50 hover:bg-[#ebe2cd]/20"
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-gray-900">
                            {option.label}
                          </div>
                          <div className="text-sm text-gray-600">
                            {option.desc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location & Radius */}
            {step === 2 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Where should we search?
                </h2>

                <div className="bg-[#ebe2cd]/50 border-2 border-[#2952a1]/30 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-3">📍</span>
                    Your Location
                  </h3>

                  {formData.location.latitude === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-6">
                        We need your location to find nearby doctors
                      </p>
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] text-white px-8 py-4 rounded-xl font-semibold hover:from-[#1e3d7a] hover:to-[#2952a1] transition-all shadow-lg"
                      >
                        📍 Use My Current Location
                      </button>
                      <p className="text-sm text-gray-500 mt-4">
                        We'll use your browser's location to find doctors near
                        you
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl p-4 border border-green-200">
                        <p className="text-green-700 font-medium flex items-center">
                          <span className="mr-2">✓</span>
                          Location detected: {formData.location.address}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Coordinates: {formData.location.latitude.toFixed(4)},{" "}
                          {formData.location.longitude.toFixed(4)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="text-[#2952a1] hover:text-[#1e3d7a] font-medium text-sm"
                      >
                        Update Location
                      </button>
                    </div>
                  )}
                </div>

                {formData.location.latitude !== 0 && (
                  <div className="bg-[#ebe2cd]/10 border-2 border-[#2952a1]/30 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">
                      Search Radius
                    </h3>
                    <div className="text-center mb-4">
                      <span className="text-4xl font-bold text-[#2952a1]">
                        {formData.location.radius} km
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        We'll search within this distance
                      </p>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 5, 10, 25, 50].map((radius) => (
                        <button
                          key={radius}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              location: { ...formData.location, radius },
                            })
                          }
                          className={`w-full p-4 border-2 rounded-xl font-semibold transition-all ${
                            formData.location.radius === radius
                              ? "border-[#2952a1] bg-[#ebe2cd]/50 text-[#2952a1]"
                              : "border-gray-200 text-gray-700 hover:border-[#2952a1]/50 hover:bg-[#ebe2cd]/20"
                          }`}
                        >
                          {radius} km{" "}
                          {radius === 1
                            ? "(Very Close)"
                            : radius === 2
                            ? "(Nearby)"
                            : radius === 5
                            ? "(Local)"
                            : radius === 10
                            ? "(City)"
                            : radius === 25
                            ? "(Regional)"
                            : "(Wide Area)"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Communication Style */}
            {step === 3 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  What's your preferred communication style?
                </h2>

                <div className="space-y-4">
                  {[
                    {
                      value: "warm-empathetic",
                      label: "Warm & Empathetic",
                      desc: "Caring, understanding, takes time to listen",
                      icon: "🤗",
                    },
                    {
                      value: "direct-efficient",
                      label: "Direct & Efficient",
                      desc: "Straightforward, gets to the point quickly",
                      icon: "⚡",
                    },
                    {
                      value: "collaborative",
                      label: "Collaborative",
                      desc: "Works with you to make decisions together",
                      icon: "🤝",
                    },
                    {
                      value: "no-preference",
                      label: "No Preference",
                      desc: "I'm flexible with communication styles",
                      icon: "🎯",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          communicationStyle: option.value,
                        })
                      }
                      className={`w-full flex items-start p-6 border-2 rounded-xl transition-all duration-200 ${
                        formData.communicationStyle === option.value
                          ? "border-[#2952a1] bg-[#ebe2cd]/30"
                          : "border-gray-200 hover:border-[#2952a1]/50 hover:bg-[#ebe2cd]/20"
                      }`}
                    >
                      <span className="text-2xl mr-4">{option.icon}</span>
                      <div className="text-left">
                        <div className="font-bold text-gray-900 text-lg">
                          {option.label}
                        </div>
                        <div className="text-gray-600 mt-1">{option.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Additional Preferences */}
            {step === 4 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Additional Preferences (Optional)
                </h2>

                {/* Languages */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "English",
                      "Spanish",
                      "French",
                      "Chinese",
                      "Hindi",
                      "Arabic",
                    ].map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            languagePreferences: toggleArrayItem(
                              formData.languagePreferences,
                              lang
                            ),
                          })
                        }
                        className={`px-4 py-2 rounded-xl font-medium transition-all ${
                          formData.languagePreferences.includes(lang)
                            ? "bg-[#2952a1] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vibe Preferences */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">
                    Vibe Preferences
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "lgbtq-affirming",
                      "family-friendly",
                      "holistic-approach",
                      "evidence-based",
                      "bilingual",
                    ].map((vibe) => (
                      <button
                        key={vibe}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            vibePreferences: toggleArrayItem(
                              formData.vibePreferences,
                              vibe
                            ),
                          })
                        }
                        className={`px-4 py-2 rounded-xl font-medium transition-all ${
                          formData.vibePreferences.includes(vibe)
                            ? "bg-[#2952a1] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {vibe.replace("-", " ")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-12">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  ← Previous
                </button>
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (step === 1 &&
                      (!formData.careType || !formData.careMode)) ||
                    (step === 2 && formData.location.latitude === 0) ||
                    (step === 3 && !formData.communicationStyle)
                  }
                  className="ml-auto bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] text-white px-8 py-3 rounded-xl font-semibold hover:from-[#1e3d7a] hover:to-[#2952a1] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="ml-auto bg-gradient-to-r from-green-600 to-[#2952a1] text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-[#1e3d7a] transition-all disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : isUpdating
                    ? "✓ Update & Find Matches"
                    : "✓ Find My Matches"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
