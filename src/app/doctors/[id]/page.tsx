/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getDoctorById } from "@/service/matchService";

export default function PublicDoctorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const doctorId = params.id as string;

  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const [messageForm, setMessageForm] = useState({
    subject: "",
    message: "",
  });

  const [appointmentForm, setAppointmentForm] = useState({
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    patientPhone: "",
    appointmentType: "in-person" as "in-person" | "virtual",
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
    fetchDoctorProfile();
  }, [doctorId]);

  const fetchDoctorProfile = async () => {
    try {
      const doctor = getDoctorById(doctorId);
      if (doctor) {
        setDoctor(doctor);
      } else {
        console.error("Doctor not found");
      }
    } catch (error) {
      console.error("Error fetching doctor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setShowMessageModal(false);
    setMessageForm({ subject: "", message: "" });
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Appointment request sent! Admin will review and approve.");
    setShowAppointmentModal(false);
    setAppointmentForm({
      appointmentDate: "",
      appointmentTime: "",
      reason: "",
      patientPhone: "",
      appointmentType: "in-person",
    });
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-[#ebe2cd] via-white to-[#ebe2cd]/50 flex items-center justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-[#ebe2cd] rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#2952a1] rounded-full animate-spin"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!doctor) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-[#ebe2cd] via-white to-[#ebe2cd]/50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Doctor not found
            </h2>
            <button
              onClick={() => router.push("/matches")}
              className="text-[#2952a1] hover:text-[#1e3d7a] font-medium"
            >
              ← Back to Matches
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-[#ebe2cd] via-white to-[#ebe2cd]/50 py-12 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="text-[#2952a1] hover:text-[#1e3d7a] font-medium mb-6 inline-flex items-center"
          >
            ← Back
          </button>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Header Section */}
            <section className="bg-linear-to-r from-[#2952a1] to-[#1e3d7a] p-8 text-white">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Doctor Image */}
                <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center text-4xl font-bold text-blue-600 shadow-lg overflow-hidden flex-shrink-0">
                  {doctor.profileImg ? (
                    <img
                      src={doctor.profileImg}
                      alt={doctor.name}
                      className="w-32 h-32 rounded-2xl object-cover"
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
                      className="w-32 h-32 rounded-2xl object-cover"
                    />
                  ) : (
                    doctor.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                  )}
                </div>

                {/* Doctor Info */}
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{doctor.name}</h1>
                  <p className="text-xl text-white/80 mb-3">
                    {doctor.specialization}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-yellow-300 text-lg">★</span>
                    <span className="text-lg font-semibold">
                      {doctor.rating || 4.5}
                    </span>
                    <span className="text-white/70">
                      ({doctor.reviewCount || 0} reviews)
                    </span>
                  </div>

                  {/* Choose Button */}
                  <button
                    onClick={() => {
                      if (!isLoggedIn) {
                        router.push(`/login?returnUrl=/doctors/${doctorId}`);
                      }
                    }}
                    className="bg-white text-[#2952a1] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg"
                  >
                    Choose This Doctor
                  </button>
                </div>
              </div>
            </section>

            {/* Main Content */}
            <div className="p-8 space-y-8">
              {/* About Section */}
              {doctor.bio && (
                <section>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    About {doctor.name.split(" ")[1]}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {doctor.bio}
                  </p>
                </section>
              )}

              {/* Credentials & Education */}
              <section>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Credentials & Education
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[#2952a1] text-xl mt-1">🎓</span>
                    <div>
                      <strong className="text-gray-900">
                        {doctor.specialization} Degree
                      </strong>
                      <p className="text-gray-600">
                        Medical School - {doctor.experience || 10}+ years of
                        experience
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2952a1] text-xl mt-1">🏥</span>
                    <div>
                      <strong className="text-gray-900">
                        {doctor.specialization} Fellowship
                      </strong>
                      <p className="text-gray-600">
                        Specialized training in {doctor.specialization}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#2952a1] text-xl mt-1">✓</span>
                    <div>
                      <strong className="text-gray-900">
                        Board Certifications
                      </strong>
                      <p className="text-gray-600">
                        American Board of {doctor.specialization}
                      </p>
                    </div>
                  </li>
                </ul>
              </section>

              {/* Specialties & Services */}
              <section>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Specialties & Services
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {doctor.vibeTags?.map((tag: string) => (
                    <div
                      key={tag}
                      className="flex items-center gap-3 p-4 bg-[#ebe2cd]/30 rounded-xl border border-[#2952a1]/20"
                    >
                      <span className="text-2xl">✨</span>
                      <span className="font-semibold text-gray-900">
                        {tag}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Languages */}
              {doctor.languages && doctor.languages.length > 0 && (
                <section>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {doctor.languages.map((lang: string) => (
                      <span
                        key={lang}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium"
                      >
                        🌐 {lang}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Consultation Options */}
              <section>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Consultation Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {doctor.inPerson && (
                    <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-xl">
                      <p className="text-2xl mb-2">🏥</p>
                      <p className="font-semibold text-gray-900">
                        In-Person Visit
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Visit at chamber location
                      </p>
                    </div>
                  )}
                  {doctor.telehealth && (
                    <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                      <p className="text-2xl mb-2">💻</p>
                      <p className="font-semibold text-gray-900">
                        Virtual Consultation
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Online video call from home
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Chamber Location */}
              {doctor.chamberLocation?.address && (
                <section>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Chamber Location
                  </h3>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">📍</span>
                      <div>
                        <p className="font-semibold text-gray-900 mb-2">
                          {doctor.chamberLocation.address}
                        </p>
                        <p className="text-gray-600 mb-3">
                          {doctor.chamberLocation.city}
                          {doctor.chamberLocation.city &&
                            doctor.chamberLocation.zipCode &&
                            ", "}
                          {doctor.chamberLocation.zipCode}
                        </p>
                        {doctor.chamberLocation.googleMapsUrl && (
                          <a
                            href={doctor.chamberLocation.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-[#2952a1] hover:text-[#1e3d7a] font-semibold"
                          >
                            View on Google Maps →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Consultation Fee */}
              <section>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Consultation Fee
                </h3>
                <div className="bg-linear-to-r from-[#2952a1]/10 to-[#1e3d7a]/10 rounded-2xl p-6 border-2 border-[#2952a1]/20">
                  <p className="text-5xl font-bold text-[#2952a1]">
                    ${doctor.consultationFee || "TBD"}
                  </p>
                  <p className="text-gray-600 mt-2">Per consultation</p>
                </div>
              </section>

              {/* Patient Reviews */}
              <section>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Patient Reviews
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Michael Chen
                        </p>
                        <p className="text-sm text-gray-500">3 days ago</p>
                      </div>
                      <span className="text-yellow-400">★★★★★</span>
                    </div>
                    <p className="text-gray-700">
                      {doctor.name} is excellent! She took the time to explain
                      my condition thoroughly and answered all my questions with
                      patience and expertise.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Lisa Rodriguez
                        </p>
                        <p className="text-sm text-gray-500">1 week ago</p>
                      </div>
                      <span className="text-yellow-400">★★★★★</span>
                    </div>
                    <p className="text-gray-700">
                      {doctor.name}'s preventive approach helped me avoid major
                      complications. She's knowledgeable, professional, and
                      genuinely cares for her patients.
                    </p>
                  </div>
                </div>
              </section>

              {/* Availability */}
              <section>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Availability
                </h3>
                <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                  <button className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all">
                    ✓ Available Today
                  </button>
                  <p className="text-gray-600 mt-3">
                    Click to book an appointment or send a message
                  </p>
                </div>
              </section>

              {/* Action Buttons */}
              <section className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      router.push(`/login?returnUrl=/doctors/${doctorId}`);
                    } else {
                      setShowAppointmentModal(true);
                    }
                  }}
                  className="flex-1 bg-[#2952a1] text-white py-4 rounded-xl font-semibold hover:bg-[#1e3d7a] transition-all shadow-lg"
                >
                  📅 Book Appointment
                </button>
                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      router.push(`/login?returnUrl=/doctors/${doctorId}`);
                    } else {
                      setShowMessageModal(true);
                    }
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  ✉️ Send Message
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && isLoggedIn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send Message to {doctor.name}
            </h2>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={messageForm.subject}
                  onChange={(e) =>
                    setMessageForm({
                      ...messageForm,
                      subject: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2952a1] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={messageForm.message}
                  onChange={(e) =>
                    setMessageForm({
                      ...messageForm,
                      message: e.target.value,
                    })
                  }
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2952a1] focus:border-transparent"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#2952a1] text-white py-3 rounded-xl font-semibold hover:bg-[#1e3d7a] transition-all"
                >
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      {showAppointmentModal && isLoggedIn && (
        <div className="fixed inset-0 bg-black/50 pt-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full my-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Book Appointment with {doctor.name}
            </h2>

            <div className="bg-[#ebe2cd]/50 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Consultation Fee
                  </p>
                  <p className="text-2xl font-bold text-[#2952a1]">
                    ${doctor.consultationFee || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Available Options
                  </p>
                  <div className="flex gap-2">
                    {doctor.inPerson && (
                      <span className="px-3 py-1 bg-[#ebe2cd] text-[#2952a1] rounded-full text-xs font-medium">
                        In-Person
                      </span>
                    )}
                    {doctor.telehealth && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Virtual
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Appointment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={appointmentForm.appointmentDate}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      appointmentDate: e.target.value,
                    })
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2952a1] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Appointment Time <span className="text-red-500">*</span>
                </label>
                <select
                  value={appointmentForm.appointmentTime}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      appointmentTime: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2952a1] focus:border-transparent"
                  required
                >
                  <option value="">Select Time</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={appointmentForm.patientPhone}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      patientPhone: e.target.value,
                    })
                  }
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2952a1] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Appointment Type <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {doctor.inPerson && (
                    <label
                      className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        appointmentForm.appointmentType === "in-person"
                          ? "border-[#2952a1] bg-[#ebe2cd]/30"
                          : "border-gray-200 hover:border-[#2952a1]/50"
                      }`}
                    >
                      <input
                        type="radio"
                        value="in-person"
                        checked={
                          appointmentForm.appointmentType === "in-person"
                        }
                        onChange={(e) =>
                          setAppointmentForm({
                            ...appointmentForm,
                            appointmentType: e.target.value as any,
                          })
                        }
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          🏥 In-Person Visit
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Visit the doctor at their chamber
                        </p>
                      </div>
                    </label>
                  )}

                  {doctor.telehealth && (
                    <label
                      className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        appointmentForm.appointmentType === "virtual"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value="virtual"
                        checked={
                          appointmentForm.appointmentType === "virtual"
                        }
                        onChange={(e) =>
                          setAppointmentForm({
                            ...appointmentForm,
                            appointmentType: e.target.value as any,
                          })
                        }
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          💻 Virtual Consultation
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Online video consultation from home
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Visit <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={appointmentForm.reason}
                  onChange={(e) =>
                    setAppointmentForm({
                      ...appointmentForm,
                      reason: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Please describe your symptoms or reason for consultation..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2952a1] focus:border-transparent"
                  required
                />
              </div>

              <div className="bg-gradient-to-r from-[#ebe2cd]/50 to-[#ebe2cd]/30 rounded-2xl p-4 border border-[#2952a1]/30">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">
                    Consultation Fee:
                  </span>
                  <span className="text-2xl font-bold text-[#2952a1]">
                    ${doctor.consultationFee || "TBD"}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  * Payment will be processed after admin approval
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] text-white py-4 rounded-xl font-semibold hover:from-[#1e3d7a] hover:to-[#2952a1] transition-all"
                >
                  📅 Request Appointment
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAppointmentModal(false);
                    setAppointmentForm({
                      appointmentDate: "",
                      appointmentTime: "",
                      reason: "",
                      patientPhone: "",
                      appointmentType: "in-person",
                    });
                  }}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Your appointment request will be sent to admin for approval.
                You'll be notified once approved.
              </p>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
