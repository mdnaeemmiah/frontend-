/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import baseApi from "@/api/baseAPi";
import { ENDPOINTS } from "@/api/endPoints";

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

// Convert 24h "HH:MM:SS" → 12h "HH:MM AM/PM" (for displaying backend times)
const convertTo12h = (time24: string): string => {
  if (!time24) return time24;
  const parts = time24.split(":");
  const h = parseInt(parts[0]);
  const minutes = parts[1] || "00";
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${String(h12).padStart(2, "0")}:${minutes} ${period}`;
};

export default function DoctorProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>("");

  const [availabilitySlots, setAvailabilitySlots] = useState<
    AvailabilitySlot[]
  >([]);
  const [newSlot, setNewSlot] = useState({
    date: "",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
  });

  const [formData, setFormData] = useState({
    // Basic Information
    full_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip_code: "",
    profile_picture: "",
    
    // Chamber Location
    chamber_address: "",
    chamber_city: "",
    google_maps_url: "",
    
    // Professional Information
    specialization: "",
    years_of_experience: 12,
    qualification: "",
    consultation_fee: 0,
    bio: "",
    
    // Languages and Communication
    languages_spoken: [] as string[],
    vibe_tags: [] as string[],
    communication_style: "warm_and_empathetic",
    
    // Care Options
    offer_telehealth: false,
    offer_in_person: false,
    accepting_new_patients: true,
    
    // Intro Video
    video_url: "",
    upload_status: "pending",
  });

  const [profileUpdateRequest, setProfileUpdateRequest] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const doctorId = localStorage.getItem("user_id") || localStorage.getItem("doctor_id");
      if (doctorId) {
        fetchProfile(doctorId);
      } else {
        setLoading(false);
        console.error("No doctor ID found in localStorage");
      }
    }
  }, [mounted]);

  // Maps the flat GET /doctors/profiles/{id}/ response
  const applyGetProfileData = (data: any) => {
    // Check if response has nested 'data' structure
    const profileData = data.data || data;
    
    // Handle nested structure from API
    const basic = profileData.basic_information || {};
    const chamber = profileData.chamber_location || {};
    const professional = profileData.professional_information || {};
    const introVideo = profileData.intro_video || {};
    const availability = profileData.availability_schedule || [];
    const langTags = profileData.languages_tags || {};
    const careOptions = langTags.care_options || {};

    // Parse vibe_tags: can be array of strings or objects
    const vibeTagsArray: string[] = (langTags.vibe_tags || []).flatMap((t: any) => {
      const raw = typeof t === "string" ? t : t.name || "";
      return raw.split(",").map((s: string) => s.trim()).filter(Boolean);
    });

    // Languages: array of strings or objects
    const languagesArray: string[] = (langTags.languages_spoken || []).map((l: any) =>
      typeof l === "string" ? l : l.name || ""
    ).filter(Boolean);

    setFormData({
      full_name: basic.full_name || "",
      email: basic.email || "",
      phone: basic.phone || "",
      address: basic.address || "",
      city: basic.city || "",
      zip_code: basic.zip_code || "",
      profile_picture: basic.profile_picture || "",

      chamber_address: chamber.chamber_address || "",
      chamber_city: chamber.city || "",
      google_maps_url: chamber.google_maps_url || "",

      specialization: professional.specialization || "",
      years_of_experience: professional.years_of_experience || 0,
      qualification: professional.qualification || "",
      consultation_fee: professional.consultation_fee || 0,
      bio: professional.bio || "",

      languages_spoken: languagesArray,
      vibe_tags: vibeTagsArray,
      communication_style: langTags.communication_style || "warm_and_empathetic",

      offer_telehealth: careOptions.offer_telehealth ?? false,
      offer_in_person: careOptions.offer_in_person ?? false,
      accepting_new_patients: careOptions.accepting_new_patients ?? true,

      video_url: introVideo.video_url || "",
      upload_status: introVideo.upload_status || "pending",
    });

    if (introVideo.video_url) setVideoPreview(introVideo.video_url);
    if (basic.profile_picture) setProfilePicturePreview(basic.profile_picture);

    // Map availability array from GET response
    if (availability.length > 0) {
      const mapped: AvailabilitySlot[] = availability.map((slot: any, i: number) => {
        const slotDate = new Date(slot.date);
        return {
          id: slot.id?.toString() || `${Date.now()}-${i}`,
          date: slot.date,
          dayOfWeek: slotDate.toLocaleDateString("en-US", { weekday: "long" }),
          startTime: convertTo12h(slot.start_time),
          endTime: convertTo12h(slot.end_time),
          status: slot.status || "pending",
          adminNotes: slot.admin_notes || "",
        };
      });
      setAvailabilitySlots(mapped);
    }
  };

  // Maps the nested UPDATE response (response.data.data)
  const applyProfileData = (data: any) => {
    const basic = data.basic_information || {};
    const chamber = data.chamber_location || {};
    const professional = data.professional_information || {};
    const langTags = data.languages_tags || {};
    const careOptions = langTags.care_options || {};
    const introVideo = data.intro_video || {};
    const availability = data.availability_schedule || [];

    // vibe_tags: array of strings, may be comma-separated within each entry
    const vibeTagsArray: string[] = (langTags.vibe_tags || []).flatMap((t: any) => {
      const raw = typeof t === "string" ? t : t.name || "";
      return raw.split(",").map((s: string) => s.trim().replace(/^"|"$/g, "")).filter(Boolean);
    });

    // availability_schedule: backend returns 24h "HH:MM:SS" → convert to 12h for display
    const mappedAvailability: AvailabilitySlot[] = availability.map((slot: any, i: number) => {
      const slotDate = new Date(slot.date);
      return {
        id: slot.id?.toString() || `${Date.now()}-${i}`,
        date: slot.date,
        dayOfWeek: slotDate.toLocaleDateString("en-US", { weekday: "long" }),
        startTime: convertTo12h(slot.start_time),
        endTime: convertTo12h(slot.end_time),
        status: slot.status || "pending",
        adminNotes: slot.admin_notes || "",
      };
    });

    setFormData({
      full_name: basic.full_name || "",
      email: basic.email || "",
      phone: basic.phone || "",
      address: basic.address || "",
      city: basic.city || "",
      zip_code: basic.zip_code || "",
      profile_picture: basic.profile_picture || "",

      chamber_address: chamber.chamber_address || "",
      chamber_city: chamber.city || "",
      google_maps_url: chamber.google_maps_url || "",

      specialization: professional.specialization || "",
      years_of_experience: professional.years_of_experience || 0,
      qualification: professional.qualification || "",
      consultation_fee: professional.consultation_fee || 0,
      bio: professional.bio || "",

      languages_spoken: Array.isArray(langTags.languages_spoken) ? langTags.languages_spoken : [],
      vibe_tags: vibeTagsArray,
      communication_style: langTags.communication_style || "warm_and_empathetic",

      offer_telehealth: careOptions.offer_telehealth ?? false,
      offer_in_person: careOptions.offer_in_person ?? false,
      accepting_new_patients: careOptions.accepting_new_patients ?? true,

      video_url: introVideo.video_url || "",
      upload_status: introVideo.upload_status || "pending",
    });

    if (introVideo.video_url) setVideoPreview(introVideo.video_url);
    if (basic.profile_picture) setProfilePicturePreview(basic.profile_picture);
    if (mappedAvailability.length > 0) setAvailabilitySlots(mappedAvailability);
  };

  const fetchProfile = async (doctorId?: string) => {
    try {
      const id = doctorId || localStorage.getItem("user_id") || localStorage.getItem("doctor_id");
      if (!id) {
        console.error("No doctor ID available");
        setLoading(false);
        return;
      }
      const response = await baseApi.get(`${ENDPOINTS.get_doctor_profile}${id}/`);
      // GET response is flat; use applyGetProfileData
      applyGetProfileData(response.data);
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
    setFormData({
      ...formData,
      google_maps_url: url,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const doctorId = localStorage.getItem("user_id");

      // Check if we have files to upload
      const hasFiles = profilePictureFile || videoFile;

      // Build JSON payload for all non-file data (nested structure)
      const jsonPayload: Record<string, any> = {
        basic_info: {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          zip_code: formData.zip_code,
          address: formData.address,
        },
        chamber_location: {
          google_maps_url: formData.google_maps_url,
          chamber_address: formData.chamber_address,
          city: formData.chamber_city,
        },
        professional_info: {
          specialization: formData.specialization,
          years_of_experience: String(formData.years_of_experience),
          qualification: formData.qualification,
          consultation_fee: String(formData.consultation_fee),
          bio: formData.bio,
        },
        availability_schedule: availabilitySlots.map((slot) => ({
          date: slot.date,
          start_time: slot.startTime,
          end_time: slot.endTime,
        })),
        preferences: {
          languages_spoken: formData.languages_spoken,
          vibe_tags: formData.vibe_tags,
          communication_style: formData.communication_style,
          care_options: {
            offer_telehealth: formData.offer_telehealth,
            offer_in_person: formData.offer_in_person,
            accepting_new_patients: formData.accepting_new_patients,
          },
        },
      };

      let response;

      if (hasFiles) {
        // Use FormData: files as form-data, other data as JSON string in "data" field
        const fd = new FormData();
        
        // Append JSON data as a string
        fd.append("data", JSON.stringify(jsonPayload));
        
        // Append files
        if (profilePictureFile) {
          fd.append("profile_picture", profilePictureFile);
        }
        if (videoFile) {
          fd.append("intro_video", videoFile);
        }

        // axios sets multipart/form-data boundary automatically
        response = await baseApi.put(
          `${ENDPOINTS.doctor_profile}${doctorId}/update/`,
          fd
        );
      } else {
        // No files — send pure JSON
        response = await baseApi.put(
          `${ENDPOINTS.doctor_profile}${doctorId}/update/`,
          jsonPayload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.data.status === "success") {
        alert(response.data.message || "Profile updated successfully!");
        // Re-fetch from GET to display the correct saved values
        await fetchProfile();
      } else {
        alert(response.data.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Failed to update profile");
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
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-gray-100">Update your professional information</p>
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
          {/* Profile Picture */}
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              {profilePicturePreview ? (
                <img
                  src={profilePicturePreview}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-green-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-green-200">
                  <span className="text-3xl text-gray-400">👤</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setProfilePictureFile(file);
                    setProfilePicturePreview(URL.createObjectURL(file));
                  }
                }}
                className="text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
              />
              <p className="text-xs text-gray-500 mt-1">JPG, PNG — max 5MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
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
                value={formData.zip_code}
                onChange={(e) =>
                  setFormData({ ...formData, zip_code: e.target.value })
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
                value={formData.google_maps_url}
                onChange={(e) => handleGoogleMapsUrlChange(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chamber Address
                </label>
                <input
                  type="text"
                  value={formData.chamber_address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chamber_address: e.target.value,
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
                  value={formData.chamber_city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chamber_city: e.target.value,
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
                value={formData.years_of_experience}
                onChange={(e) =>
                  setFormData({ ...formData, years_of_experience: parseInt(e.target.value) || 0 })
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
                value={formData.consultation_fee}
                onChange={(e) =>
                  setFormData({ ...formData, consultation_fee: parseFloat(e.target.value) || 0 })
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
       
            </div>
          </div>
        </div>

        {/* Availability Slots */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Availability Schedule 📅
          </h2>
          <div className="space-y-4">
            {/* <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                📅 Add specific dates when you're available. Admin will approve
                your schedule.
              </p>
            </div> */}

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
                        languages_spoken: toggleArrayItem(formData.languages_spoken, lang),
                      })
                    }
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      formData.languages_spoken.includes(lang)
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
                        vibe_tags: toggleArrayItem(formData.vibe_tags, tag),
                      })
                    }
                    className={`px-3 py-1 rounded-lg font-medium transition-all ${
                      formData.vibe_tags.includes(tag)
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
                    formData.communication_style === "warm_and_empathetic"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <input
                    type="radio"
                    value="warm_and_empathetic"
                    checked={formData.communication_style === "warm_and_empathetic"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        communication_style: e.target.value,
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
                    formData.communication_style === "direct-efficient"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <input
                    type="radio"
                    value="direct-efficient"
                    checked={formData.communication_style === "direct-efficient"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        communication_style: e.target.value,
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
                    formData.communication_style === "collaborative"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <input
                    type="radio"
                    value="collaborative"
                    checked={formData.communication_style === "collaborative"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        communication_style: e.target.value,
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
                    checked={formData.offer_telehealth}
                    onChange={(e) =>
                      setFormData({ ...formData, offer_telehealth: e.target.checked })
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
                    checked={formData.offer_in_person}
                    onChange={(e) =>
                      setFormData({ ...formData, offer_in_person: e.target.checked })
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
                    checked={formData.accepting_new_patients}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accepting_new_patients: e.target.checked,
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
