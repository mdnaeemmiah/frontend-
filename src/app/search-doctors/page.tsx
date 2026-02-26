/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { getAllDoctors } from "@/service/doctorService";
import { toast, Toaster } from "sonner";

export default function SearchDoctors() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllDoctors();
  }, []);

  const fetchAllDoctors = async () => {
    try {
      setLoading(true);
      const response = await getAllDoctors();
      if (response.success && response.doctors) {
        setDoctors(response.doctors);
      }
    } catch (error: any) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to load doctors", {
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Group doctors by specialty_name
  const groupedDoctors = doctors.reduce((acc: any, doctor: any) => {
    const spec = doctor.specialty_name || "Other";
    if (!acc[spec]) {
      acc[spec] = [];
    }
    acc[spec].push(doctor);
    return acc;
  }, {});

  // Filter doctors based on search term
  const filteredGroupedDoctors = Object.keys(groupedDoctors).reduce(
    (acc: any, spec: string) => {
      const filtered = groupedDoctors[spec].filter(
        (doctor: any) =>
          doctor.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialty_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[spec] = filtered;
      }
      return acc;
    },
    {}
  );

  const getSpecializationIcon = (specialization: string) => {
    const icons: any = {
      Cardiologist: "❤️",
      "Orthopedic Surgeon": "🦴",
      "Family Medicine": "👨‍⚕️",
      Neurologist: "🧠",
      Dermatology: "🩹",
      Pediatrics: "👶",
      Psychiatry: "🧠",
      Oncology: "🏥",
      "General Medicine": "⚕️",
      "Mental Health Care": "🧠",
      Acupuncture: "🧬",
      "Dental Care": "🦷",
    };
    return icons[specialization] || "⚕️";
  };

  const getSpecializationDescription = (specialization: string) => {
    const descriptions: any = {
      Cardiologist: "Heart and cardiovascular specialists",
      "Orthopedic Surgeon": "Bone and joint specialists",
      "Family Medicine": "General healthcare providers",
      Neurologist: "Brain and nervous system specialists",
      "General Medicine": "Primary care physicians",
      "Mental Health Care": "Psychiatrists and therapists",
      Acupuncture: "Traditional Chinese medicine practitioners",
      "Dental Care": "Oral health specialists",
    };
    return descriptions[specialization] || "Healthcare specialists";
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-[#2952a1] flex items-center justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-[#ebe2cd] rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#2952a1] rounded-full animate-spin"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      <Navigation />
      <div className="min-h-screen bg-[#2952a1]">
        {/* Header Section */}
        <div className="bg-linear-to-r bg-[#2952a1] text-white py-12 px-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-3">
              Find the Right Doctor for Your Needs
            </h1>
            <p className="text-white/80 mb-8">
              Browse doctors by specialty and service. Connect with qualified
              healthcare professionals ready to help you.
            </p>

            {/* Search Bar */}
            <div className="flex gap-3 ">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by service, specialty, or doctor name"
                className="flex-1 border border-white px-6 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-8 py-3 bg-white text-[#2952a1] rounded-xl font-semibold hover:bg-gray-100 transition-all">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filters Info */}
          <div className="flex items-center gap-4 mb-8 text-sm text-gray-600 bg-white p-2 rounded-xl">
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300">
              ☰ Filters
            </button>
            <select className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300">
              <option>All Locations</option>
            </select>
            <select className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300">
              <option>Experience</option>
            </select>
            <select className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300">
              <option>Rating</option>
            </select>
            <span className="ml-auto text-gray-500">
              Showing {doctors.length} doctors
            </span>
          </div>

          {/* Grouped Doctors by Specialization */}
          <div className="space-y-12">
            {Object.keys(filteredGroupedDoctors).map((specialization) => (
              <div key={specialization}>
                {/* Specialization Header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl bg-white/80 rounded-xl p-3">
                    {getSpecializationIcon(specialization)}
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {specialization}
                    </h2>
                    <p className="text-sm text-gray-100">
                      {getSpecializationDescription(specialization)}
                    </p>
                  </div>
                </div>

                {/* Doctor Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredGroupedDoctors[specialization].map((doctor: any) => (
                    <div
                      key={doctor.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 p-6"
                    >
                      {/* Doctor Image and Name - Left Aligned */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="shrink-0 w-20 h-20">
                          {doctor.profile_picture ? (
                            <img
                              src={doctor.profile_picture}
                              alt={doctor.user_name}
                              className="w-full h-full rounded-full object-cover border-2 border-white shadow-md"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center text-2xl font-bold text-blue-600 shadow-md border-2 border-white">
                              {doctor.user_name?.split(' ').map((n: string) => n[0]).join('') || 'DR'}
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {doctor.user_name || 'Dr. Unknown'}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {doctor.specialty_name}
                          </p>

                          {/* Rating */}
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-sm ${
                                  star <= Math.round(doctor.average_rating || 0)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                            <span className="text-xs text-gray-500 ml-1">
                              ({doctor.total_ratings || 0})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        {doctor.city && (
                          <span className="flex items-center gap-1">
                            📍 {doctor.city}
                          </span>
                        )}
                        {doctor.years_of_experience && (
                          <span className="flex items-center gap-1">
                            💼 {doctor.years_of_experience} years
                          </span>
                        )}
                      </div>

                      {/* Vibe Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {doctor.vibe_tags?.slice(0, 3).map((tag: any) => (
                          <span
                            key={tag.id}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>

                      {/* Book Button */}
                      <button
                        onClick={() => router.push(`/doctors/${doctor.id}`)}
                        className="w-full bg-[#2952a1] text-white py-3 rounded-lg font-semibold hover:bg-[#1e3d7a] transition-all"
                      >
                        Book Appointment
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {Object.keys(filteredGroupedDoctors).length === 0 && (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No doctors found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search terms or filters
              </p>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
