/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const specializations = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "General Medicine",
  "Psychiatry",
  "Oncology",
  "Endocrinology",
  "Gastroenterology",
];

const vibeTags = [
  "warm-empathetic",
  "direct-efficient",
  "lgbtq-affirming",
  "bilingual",
  "family-friendly",
  "holistic-approach",
  "evidence-based",
  "patient-centered",
];

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Hindi",
  "Arabic",
  "Portuguese",
  "Bengali",
];

const timeSlots = [
  "06:00 AM",
  "06:30 AM",
  "07:00 AM",
  "07:30 AM",
  "08:00 AM",
  "08:30 AM",
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
  "08:30 PM",
  "09:00 PM",
  "09:30 PM",
  "10:00 PM",
];

interface AvailabilitySlot {
  id: string;
  date: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  status: "pending" | "approved" | "rejected";
  adminNotes?: string;
}

export default function DoctorProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");

  const [availabilitySlots, setAvailabilitySlots] = useState<
    AvailabilitySlot[]
  >([]);
  const [newSlot, setNewSlot] = useState({
    date: "",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    chamberLocation: {
      address: "",
      city: "",
      zipCode: "",
      coordinates: {
        type: "Point" as const,
        coordinates: [0, 0] as [number, number],
      },
      googleMapsUrl: "",
    },
    specialization: "",
    experience: "",
    qualification: "",
    bio: "",
    languages: [] as string[],
    insuranceAccepted: [] as string[],
    vibeTags: [] as string[],
    communicationStyle: "warm-empathetic" as any,
    consultationFee: "",
    telehealth: false,
    inPerson: false,
    acceptsNewPatients: true,
    introVideo: "",
  });

  const [profileUpdateRequest, setProfileUpdateRequest] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || ""}/api/user/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const result = await response.json();
      if (result.success) {
        const doctor = result.data;
        setFormData({
          name: doctor.name || "",
          email: doctor.email || "",
          phone: doctor.phone || "",
          address: doctor.address || "",
          city: doctor.city || "",
          zipCode: doctor.zipCode || "",
          chamberLocation: doctor.chamberLocation || {
            address: "",
            city: "",
            zipCode: "",
            coordinates: { type: "Point", coordinates: [0, 0] },
            googleMapsUrl: "",
          },
          specialization: doctor.specialization || "",
          experience: doctor.experience?.toString() || "",
          qualification: doctor.qualification || "",
          bio: doctor.bio || "",
          languages: doctor.languages || [],
          insuranceAccepted: doctor.insuranceAccepted || [],
          vibeTags: doctor.vibeTags || [],
          communicationStyle: doctor.communicationStyle || "warm-empathetic",
          consultationFee: doctor.consultationFee?.toString() || "",
          telehealth: doctor.telehealth || false,
          inPerson: doctor.inPerson || false,
          acceptsNewPatients: doctor.acceptsNewPatients ?? true,
          introVideo: doctor.introVideo || "",
        });

        if (doctor.introVideo) setVideoPreview(doctor.introVideo);
        if (doctor.availabilitySlots)
          setAvailabilitySlots(doctor.availabilitySlots);
        if (doctor.profileUpdateRequest)
          setProfileUpdateRequest(doctor.profileUpdateRequest);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert("Video file size should be less than 50MB");
        return;
      }
      if (!file.type.startsWith("video/")) {
        alert("Please select a valid video file");
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleVideoUpload = async () => {
    if (!videoFile) {
      alert("Please select a video file");
      return;
    }
    setUploadingVideo(true);
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("video", videoFile);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || "https://practice-backend-oauth-image-video.vercel.app"}/api/doctor/my-intro-video`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Video uploaded successfully!");
        setVideoFile(null);
        fetchProfile();
      } else {
        alert(result.message || "Failed to upload video");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video");
    } finally {
      setUploadingVideo(false);
    }
  };

  const addAvailabilitySlot = () => {
    if (!newSlot.date) {
      alert("Please select a date");
      return;
    }

    const date = new Date(newSlot.date);
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

    const slot: AvailabilitySlot = {
      id: Date.now().toString(),
      date: newSlot.date,
      dayOfWeek,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      status: "pending",
    };

    setAvailabilitySlots([...availabilitySlots, slot]);
    setNewSlot({ date: "", startTime: "09:00 AM", endTime: "05:00 PM" });
  };

  const removeAvailabilitySlot = (id: string) => {
    setAvailabilitySlots(availabilitySlots.filter((slot) => slot.id !== id));
  };

  const extractCoordinatesFromGoogleMaps = (
    url: string
  ): [number, number] | null => {
    try {
      const match1 = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match1) return [parseFloat(match1[2]), parseFloat(match1[1])];
      const match2 = url.match(/\?q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match2) return [parseFloat(match2[2]), parseFloat(match2[1])];
      return null;
    } catch (error) {
      return null;
    }
  };

  const handleGoogleMapsUrlChange = (url: string) => {
    const coordinates = extractCoordinatesFromGoogleMaps(url);
    if (coordinates) {
      setFormData({
        ...formData,
        chamberLocation: {
          ...formData.chamberLocation,
          googleMapsUrl: url,
          coordinates: { type: "Point", coordinates },
        },
      });
    } else {
      setFormData({
        ...formData,
        chamberLocation: { ...formData.chamberLocation, googleMapsUrl: url },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || "https://practice-backend-oauth-image-video.vercel.app"}/api/doctor/my-profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            experience: formData.experience
              ? parseInt(formData.experience)
              : undefined,
            consultationFee: formData.consultationFee
              ? parseFloat(formData.consultationFee)
              : undefined,
            availabilitySlots,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert(
          "Profile update request submitted successfully! Waiting for admin approval."
        );
        fetchProfile();
      } else {
        alert(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Update your professional information</p>
      </div>

      {/* Profile Update Status Banner */}
      {profileUpdateRequest && profileUpdateRequest.status !== "none" && (
        <div
          className={`mb-6 p-6 rounded-xl border-2 ${
            profileUpdateRequest.status === "pending"
              ? "bg-yellow-50 border-yellow-500"
              : profileUpdateRequest.status === "approved"
              ? "bg-green-50 border-green-500"
              : "bg-red-50 border-red-500"
          }`}
        >
          <div className="flex items-start space-x-4">
            <div className="text-3xl">
              {profileUpdateRequest.status === "pending"
                ? "⏳"
                : profileUpdateRequest.status === "approved"
                ? "✅"
                : "❌"}
            </div>
            <div className="flex-1">
              <h3
                className={`text-lg font-bold mb-2 ${
                  profileUpdateRequest.status === "pending"
                    ? "text-yellow-900"
                    : profileUpdateRequest.status === "approved"
                    ? "text-green-900"
                    : "text-red-900"
                }`}
              >
                {profileUpdateRequest.status === "pending"
                  ? "Profile Update Pending Review"
                  : profileUpdateRequest.status === "approved"
                  ? "Profile Update Approved!"
                  : "Profile Update Rejected"}
              </h3>
              <p
                className={`text-sm mb-2 ${
                  profileUpdateRequest.status === "pending"
                    ? "text-yellow-800"
                    : profileUpdateRequest.status === "approved"
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {profileUpdateRequest.status === "pending"
                  ? `Submitted on ${new Date(
                      profileUpdateRequest.requestedAt
                    ).toLocaleDateString()}. Waiting for admin approval.`
                  : profileUpdateRequest.status === "approved"
                  ? `Approved on ${new Date(
                      profileUpdateRequest.reviewedAt
                    ).toLocaleDateString()} by ${
                      profileUpdateRequest.reviewedBy
                    }`
                  : `Rejected on ${new Date(
                      profileUpdateRequest.reviewedAt
                    ).toLocaleDateString()} by ${
                      profileUpdateRequest.reviewedBy
                    }`}
              </p>
              {profileUpdateRequest.adminNotes && (
                <div className="mt-3 p-3 bg-white rounded-lg">
                  <p className="text-sm font-semibold text-gray-700">
                    Admin Notes:
                  </p>
                  <p className="text-sm text-gray-600">
                    {profileUpdateRequest.adminNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) =>
                  setFormData({ ...formData, zipCode: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Chamber Location */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Chamber Location 📍
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Google Maps URL
              </label>
              <input
                type="url"
                value={formData.chamberLocation.googleMapsUrl}
                onChange={(e) => handleGoogleMapsUrlChange(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              {formData.chamberLocation.coordinates.coordinates[0] !== 0 && (
                <p className="mt-2 text-sm text-green-600">
                  ✓ Coordinates:{" "}
                  {formData.chamberLocation.coordinates.coordinates[1].toFixed(
                    6
                  )}
                  ,{" "}
                  {formData.chamberLocation.coordinates.coordinates[0].toFixed(
                    6
                  )}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chamber Address
                </label>
                <input
                  type="text"
                  value={formData.chamberLocation.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chamberLocation: {
                        ...formData.chamberLocation,
                        address: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.chamberLocation.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chamberLocation: {
                        ...formData.chamberLocation,
                        city: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Professional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Specialization
              </label>
              <select
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Specialization</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Qualification
              </label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) =>
                  setFormData({ ...formData, qualification: e.target.value })
                }
                placeholder="e.g., MD, MBBS, DO"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Consultation Fee ($)
              </label>
              <input
                type="number"
                value={formData.consultationFee}
                onChange={(e) =>
                  setFormData({ ...formData, consultationFee: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                min="0"
                step="0.01"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={3}
                placeholder="Tell patients about yourself..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Intro Video */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Intro Video 🎥
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                📹 Upload a 30-60 second video introducing yourself (Max 50MB)
              </p>
            </div>
            {videoPreview && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Video
                </label>
                <video
                  src={videoPreview}
                  controls
                  className="w-full max-w-2xl bg-black rounded-lg"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={handleVideoUpload}
                disabled={!videoFile || uploadingVideo}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
              >
                {uploadingVideo ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>

        {/* Availability Slots */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Availability Schedule 📅
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                📅 Add specific dates when you're available. Admin will approve
                your schedule.
              </p>
            </div>

            {/* Add New Slot */}
            <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <h3 className="font-semibold text-gray-900 mb-3">
                Add New Availability
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newSlot.date}
                    onChange={(e) =>
                      setNewSlot({ ...newSlot, date: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Time
                  </label>
                  <select
                    value={newSlot.startTime}
                    onChange={(e) =>
                      setNewSlot({ ...newSlot, startTime: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Time
                  </label>
                  <select
                    value={newSlot.endTime}
                    onChange={(e) =>
                      setNewSlot({ ...newSlot, endTime: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addAvailabilitySlot}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                  >
                    + Add Slot
                  </button>
                </div>
              </div>
            </div>

            {/* Existing Slots */}
            {availabilitySlots.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">
                  Your Availability Slots
                </h3>
                {availabilitySlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-4 rounded-lg border-2 ${
                      slot.status === "approved"
                        ? "border-green-500 bg-green-50"
                        : slot.status === "rejected"
                        ? "border-red-500 bg-red-50"
                        : "border-yellow-500 bg-yellow-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-lg font-bold text-gray-900">
                            {new Date(slot.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              slot.status === "approved"
                                ? "bg-green-600 text-white"
                                : slot.status === "rejected"
                                ? "bg-red-600 text-white"
                                : "bg-yellow-600 text-white"
                            }`}
                          >
                            {slot.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          🕐 {slot.startTime} - {slot.endTime}
                        </p>
                        {slot.adminNotes && (
                          <p className="text-sm text-gray-600 mt-2">
                            <span className="font-semibold">Admin Notes:</span>{" "}
                            {slot.adminNotes}
                          </p>
                        )}
                      </div>
                      {slot.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => removeAvailabilitySlot(slot.id)}
                          className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Languages, Vibe Tags, Care Options */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Languages & Tags
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Languages Spoken
              </label>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        languages: toggleArrayItem(formData.languages, lang),
                      })
                    }
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      formData.languages.includes(lang)
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vibe Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {vibeTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        vibeTags: toggleArrayItem(formData.vibeTags, tag),
                      })
                    }
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      formData.vibeTags.includes(tag)
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Communication Style
              </label>
              <div className="space-y-3">
                <label
                  className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.communicationStyle === "warm-empathetic"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <input
                    type="radio"
                    value="warm-empathetic"
                    checked={formData.communicationStyle === "warm-empathetic"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        communicationStyle: e.target.value,
                      })
                    }
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 flex items-center">
                      🤗 Warm & Empathetic
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Caring, understanding, takes time to listen
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.communicationStyle === "direct-efficient"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <input
                    type="radio"
                    value="direct-efficient"
                    checked={formData.communicationStyle === "direct-efficient"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        communicationStyle: e.target.value,
                      })
                    }
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 flex items-center">
                      ⚡ Direct & Efficient
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Straightforward, gets to the point quickly
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.communicationStyle === "collaborative"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <input
                    type="radio"
                    value="collaborative"
                    checked={formData.communicationStyle === "collaborative"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        communicationStyle: e.target.value,
                      })
                    }
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 flex items-center">
                      🤝 Collaborative
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Works with you to make decisions together
                    </p>
                  </div>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Care Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.telehealth}
                    onChange={(e) =>
                      setFormData({ ...formData, telehealth: e.target.checked })
                    }
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-gray-700 font-medium">
                    Offer Telehealth Appointments
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inPerson}
                    onChange={(e) =>
                      setFormData({ ...formData, inPerson: e.target.checked })
                    }
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-gray-700 font-medium">
                    Offer In-Person Appointments
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptsNewPatients}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        acceptsNewPatients: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-gray-700 font-medium">
                    Accepting New Patients
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
