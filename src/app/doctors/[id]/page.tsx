/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function PublicDoctorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const doctorId = params.id as string;

  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [messageForm, setMessageForm] = useState({
    subject: "",
    message: "",
  });

  const [appointmentForm, setAppointmentForm] = useState({
    appointmentDate: "",
    appointmentDay: "",
    appointmentTime: "",
    appointmentType: "in-person" as "in-person" | "virtual",
    reason: "",
    patientPhone: "",
  });

  const [availableTimeSlots, setAvailableTimeSlots] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
    fetchDoctorProfile();
  }, [doctorId]);

  const fetchDoctorProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || "https://practice-backend-oauth-image-video.vercel.app"}/api/doctor/${doctorId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const result = await response.json();
      if (result.success) {
        setDoctor(result.data);
      }
    } catch (error) {
      console.error("Error fetching doctor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: "message" | "appointment") => {
    if (!isLoggedIn) {
      router.push(`/login?returnUrl=/doctors/${doctorId}`);
      return;
    }

    if (action === "message") {
      setShowMessageModal(true);
    } else {
      setShowAppointmentModal(true);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      router.push(`/login?returnUrl=/doctors/${doctorId}`);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || "https://practice-backend-oauth-image-video.vercel.app"}/api/user/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userData = await userResponse.json();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || "https://practice-backend-oauth-image-video.vercel.app"}/api/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId: userData.data._id,
            patientName: userData.data.name,
            patientEmail: userData.data.email,
            doctorId: doctor._id,
            subject: messageForm.subject,
            message: messageForm.message,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Message sent successfully!");
        setShowMessageModal(false);
        setMessageForm({ subject: "", message: "" });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  const handleDateChange = (date: string) => {
    setAppointmentForm({
      ...appointmentForm,
      appointmentDate: date,
      appointmentTime: "",
    });

    // Check if the selected date matches any approved availability slot
    const matchingSlot = doctor?.availabilitySlots?.find(
      (slot: any) =>
        slot.status === "approved" &&
        new Date(slot.date).toISOString().split("T")[0] === date
    );

    if (matchingSlot) {
      // Create time slots array from the slot's start and end time
      setAvailableTimeSlots([
        {
          startTime: matchingSlot.startTime,
          endTime: matchingSlot.endTime,
        },
      ]);
      setAppointmentForm((prev) => ({
        ...prev,
        appointmentDay: matchingSlot.dayOfWeek,
        appointmentTime: matchingSlot.startTime, // Auto-select the time
      }));
    } else {
      setAvailableTimeSlots([]);
      alert(
        "Doctor is not available on this date. Please select a date from the available dates shown above."
      );
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      router.push(`/login?returnUrl=/doctors/${doctorId}`);
      return;
    }

    if (
      !appointmentForm.appointmentDate ||
      !appointmentForm.appointmentDay ||
      !appointmentForm.appointmentTime
    ) {
      alert("Please fill in date, day, and time");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || "https://practice-backend-oauth-image-video.vercel.app"}/api/user/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userData = await userResponse.json();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || "https://practice-backend-oauth-image-video.vercel.app"}/api/appointment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId: userData.data._id,
            patientName: userData.data.name,
            patientEmail: userData.data.email,
            patientPhone: appointmentForm.patientPhone,
            doctorId: doctor._id,
            doctorName: doctor.name,
            appointmentDate: appointmentForm.appointmentDate,
            appointmentTime: appointmentForm.appointmentTime,
            appointmentType: appointmentForm.appointmentType,
            reason: appointmentForm.reason,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Appointment request sent! Admin will review and approve.");
        setShowAppointmentModal(false);
        setAppointmentForm({
          appointmentDate: "",
          appointmentDay: "",
          appointmentTime: "",
          appointmentType: "in-person",
          reason: "",
          patientPhone: "",
        });
        setAvailableTimeSlots([]);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment");
    }
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
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.back()}
            className="text-[#2952a1] hover:text-[#1e3d7a] font-medium mb-6 inline-flex items-center"
          >
            ← Back
          </button>

          {!isLoggedIn && (
            <div className="bg-[#ebe2cd]/50 border-2 border-[#2952a1]/30 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">ℹ️</div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#2952a1] text-lg mb-2">
                    Want to book an appointment or send a message?
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Please log in to your account to book appointments or send
                    messages to doctors.
                  </p>
                  <button
                    onClick={() =>
                      router.push(`/login?returnUrl=/doctors/${doctorId}`)
                    }
                    className="bg-[#2952a1] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#1e3d7a] transition-all"
                  >
                    Log In
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] p-8 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center text-4xl font-bold text-blue-600 shadow-lg">
                    {doctor.profileImg ? (
                      <img
                        src={doctor.profileImg}
                        alt={doctor.name}
                        className="w-24 h-24 rounded-2xl object-cover"
                      />
                    ) : (
                      doctor.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                    )}
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{doctor.name}</h1>
                    <p className="text-xl text-white/80 mb-2">
                      {doctor.specialization}
                    </p>
                    <div className="flex items-center space-x-4">
                      {doctor.rating && (
                        <div className="flex items-center">
                          <span className="text-yellow-300">★</span>
                          <span className="ml-1">{doctor.rating}/5</span>
                        </div>
                      )}
                      {doctor.experience && (
                        <span>{doctor.experience} years experience</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {doctor.introVideo && (
                  <button
                    onClick={() => setShowVideoModal(true)}
                    className="flex items-center justify-center p-4 bg-purple-100 text-purple-700 rounded-xl font-semibold hover:bg-purple-200 transition-all"
                  >
                    🎥 Watch Intro Video
                  </button>
                )}
                <button
                  onClick={() => handleActionClick("message")}
                  className="flex items-center justify-center p-4 bg-blue-100 text-blue-700 rounded-xl font-semibold hover:bg-blue-200 transition-all"
                >
                  ✉️ Send Message
                </button>
                <button
                  onClick={() => handleActionClick("appointment")}
                  className="flex items-center justify-center p-4 bg-green-100 text-green-700 rounded-xl font-semibold hover:bg-green-200 transition-all"
                >
                  📅 Book Appointment
                </button>
              </div>

              {doctor.bio && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    About
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {doctor.qualification && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Qualification
                    </h3>
                    <p className="text-gray-700">{doctor.qualification}</p>
                  </div>
                )}

                {doctor.consultationFee && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Consultation Fee
                    </h3>
                    <p className="text-gray-700 text-2xl font-bold text-green-600">
                      ${doctor.consultationFee}
                    </p>
                  </div>
                )}

                {doctor.languages && doctor.languages.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {doctor.languages.map((lang: string) => (
                        <span
                          key={lang}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Care Options</h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.telehealth && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        Virtual
                      </span>
                    )}
                    {doctor.inPerson && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        In-Person
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {doctor.vibeTags && doctor.vibeTags.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-bold text-gray-900 mb-3">Vibe Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.vibeTags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl text-sm font-medium"
                      >
                        ✨ {tag.replace("-", " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {doctor.communicationStyle && (
                <div className="mb-8">
                  <h3 className="font-bold text-gray-900 mb-3">
                    Communication Style
                  </h3>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">
                        {doctor.communicationStyle === "warm-empathetic" &&
                          "🤗"}
                        {doctor.communicationStyle === "direct-efficient" &&
                          "⚡"}
                        {doctor.communicationStyle === "collaborative" && "🤝"}
                      </div>
                      <div>
                        <p className="font-bold text-lg text-gray-900 mb-1">
                          {doctor.communicationStyle === "warm-empathetic" &&
                            "Warm & Empathetic"}
                          {doctor.communicationStyle === "direct-efficient" &&
                            "Direct & Efficient"}
                          {doctor.communicationStyle === "collaborative" &&
                            "Collaborative"}
                        </p>
                        <p className="text-sm text-gray-700">
                          {doctor.communicationStyle === "warm-empathetic" &&
                            "Caring, understanding, takes time to listen"}
                          {doctor.communicationStyle === "direct-efficient" &&
                            "Straightforward, gets to the point quickly"}
                          {doctor.communicationStyle === "collaborative" &&
                            "Works with you to make decisions together"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {doctor.chamberLocation?.address && (
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3">
                    📍 Chamber Location
                  </h3>
                  <p className="text-gray-700">
                    {doctor.chamberLocation.address}
                  </p>
                  {(doctor.chamberLocation.city ||
                    doctor.chamberLocation.zipCode) && (
                    <p className="text-gray-700">
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
                      className="inline-block mt-3 text-[#2952a1] hover:text-[#1e3d7a] font-medium"
                    >
                      View on Google Maps →
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {showVideoModal && doctor.introVideo && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="max-w-4xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">
                  Intro Video - {doctor.name}
                </h2>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="text-white hover:text-gray-300 text-3xl"
                >
                  ×
                </button>
              </div>
              <div className="bg-black rounded-2xl overflow-hidden">
                <video
                  src={doctor.introVideo}
                  controls
                  autoPlay
                  className="w-full max-h-[70vh]"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        )}

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
          <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto pt-20">
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

              {/* Doctor's Availability Schedule */}
              {doctor.availabilitySlots &&
                doctor.availabilitySlots.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-3">
                      📅 Doctor's Available Dates & Times
                    </h3>
                    <div className="bg-gray-50 rounded-2xl p-4 max-h-80 overflow-y-auto">
                      <div className="space-y-3">
                        {doctor.availabilitySlots
                          .filter((slot: any) => slot.status === "approved")
                          .sort(
                            (a: any, b: any) =>
                              new Date(a.date).getTime() -
                              new Date(b.date).getTime()
                          )
                          .map((slot: any, idx: number) => (
                            <div
                              key={idx}
                              className="bg-white rounded-xl p-4 border-2 border-[#2952a1]/30"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className="text-2xl">📆</div>
                                  <div>
                                    <p className="font-bold text-[#2952a1]">
                                      {new Date(slot.date).toLocaleDateString(
                                        "en-US",
                                        {
                                          weekday: "long",
                                          month: "long",
                                          day: "numeric",
                                          year: "numeric",
                                        }
                                      )}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {slot.dayOfWeek}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-3">
                                <span className="text-sm font-semibold text-gray-700">
                                  Time:
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                                  🕐 {slot.startTime} - {slot.endTime}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                      {doctor.availabilitySlots.filter(
                        (slot: any) => slot.status === "approved"
                      ).length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-gray-500">
                            No approved availability slots yet
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      ℹ️ Select a date below from the available dates shown
                      above
                    </p>
                  </div>
                )}

              <form onSubmit={handleBookAppointment} className="space-y-4">
                {/* Date Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Appointment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={appointmentForm.appointmentDate}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      const dayOfWeek = selectedDate
                        .toLocaleDateString("en-US", { weekday: "long" })
                        .toLowerCase();
                      setAppointmentForm({
                        ...appointmentForm,
                        appointmentDate: e.target.value,
                        appointmentDay: dayOfWeek,
                      });
                    }}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2952a1] focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Select appointment date from calendar
                  </p>
                </div>

                {/* Day Display (Auto-filled) */}
                {appointmentForm.appointmentDate && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Day of Week
                    </label>
                    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 font-medium capitalize">
                      {appointmentForm.appointmentDay || "Select a date first"}
                    </div>
                  </div>
                )}

                {/* Time Input */}
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
                    <option value="06:00 AM">06:00 AM</option>
                    <option value="06:30 AM">06:30 AM</option>
                    <option value="07:00 AM">07:00 AM</option>
                    <option value="07:30 AM">07:30 AM</option>
                    <option value="08:00 AM">08:00 AM</option>
                    <option value="08:30 AM">08:30 AM</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="12:30 PM">12:30 PM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="05:30 PM">05:30 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                    <option value="06:30 PM">06:30 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
                    <option value="07:30 PM">07:30 PM</option>
                    <option value="08:00 PM">08:00 PM</option>
                    <option value="08:30 PM">08:30 PM</option>
                    <option value="09:00 PM">09:00 PM</option>
                    <option value="09:30 PM">09:30 PM</option>
                    <option value="10:00 PM">10:00 PM</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Select appointment time
                  </p>
                </div>

                {/* Summary Box */}
                {appointmentForm.appointmentDate &&
                  appointmentForm.appointmentDay &&
                  appointmentForm.appointmentTime && (
                    <div className="p-4 bg-[#ebe2cd]/50 border-2 border-[#2952a1]/30 rounded-xl">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        📋 Appointment Summary:
                      </p>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-700">
                          <span className="font-semibold">Date:</span>{" "}
                          {new Date(
                            appointmentForm.appointmentDate
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Day:</span>{" "}
                          <span className="capitalize">
                            {appointmentForm.appointmentDay}
                          </span>
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Time:</span>{" "}
                          {appointmentForm.appointmentTime}
                        </p>
                      </div>
                    </div>
                  )}

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
                          <div className="font-semibold text-gray-900 flex items-center">
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
                          <div className="font-semibold text-gray-900 flex items-center">
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
                    disabled={!doctor.inPerson && !doctor.telehealth}
                    className="flex-1 bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] text-white py-4 rounded-xl font-semibold hover:from-[#1e3d7a] hover:to-[#2952a1] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    📅 Request Appointment
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAppointmentModal(false);
                      setAppointmentForm({
                        appointmentDate: "",
                        appointmentDay: "",
                        appointmentTime: "",
                        appointmentType: "in-person",
                        reason: "",
                        patientPhone: "",
                      });
                      setAvailableTimeSlots([]);
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
      </div>
      <Footer />
    </>
  );
}
