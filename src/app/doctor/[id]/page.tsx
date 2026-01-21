/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function DoctorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const doctorId = params.id as string;

  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

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
    fetchDoctorProfile();
  }, [doctorId]);

  const fetchDoctorProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:5000/api/doctor/${doctorId}`,
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");
      const userResponse = await fetch(
        `http://localhost:5000/api/user/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userData = await userResponse.json();

      const response = await fetch(
        `http://localhost:5000/api/message`,
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

    // First check if there's a specific date availability
    const specificDateAvail = doctor?.availability
      ?.flatMap((avail: any) => avail.specificDates || [])
      .find(
        (sd: any) => new Date(sd.date).toISOString().split("T")[0] === date
      );

    if (specificDateAvail && specificDateAvail.isAvailable) {
      setAvailableTimeSlots(specificDateAvail.timeSlots);
      return;
    }

    // Otherwise check weekly availability
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    const dayAvailability = doctor?.availability?.find(
      (avail: any) => avail.day.toLowerCase() === dayOfWeek && avail.isAvailable
    );

    if (dayAvailability) {
      setAvailableTimeSlots(dayAvailability.timeSlots);
      setAppointmentForm((prev) => ({ ...prev, appointmentDay: dayOfWeek }));
    } else {
      setAvailableTimeSlots([]);
      alert("Doctor is not available on this day. Please select another date.");
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!appointmentForm.appointmentDate || !appointmentForm.appointmentTime) {
      alert("Please select both date and time");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const userResponse = await fetch(
        `http://localhost:5000/api/user/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userData = await userResponse.json();

      const response = await fetch(
        `http://localhost:5000/api/appointment`,
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
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Doctor not found
          </h2>
          <button
            onClick={() => router.push("/matches")}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Matches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-700 font-medium mb-6 inline-flex items-center"
        >
          ← Back
        </button>

        {/* Doctor Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-linear-to-r from-blue-600 to-purple-600 p-8 text-white">
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
                  <p className="text-xl text-blue-100 mb-2">
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

          {/* Content Section */}
          <div className="p-8">
            {/* Quick Actions */}
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
                onClick={() => setShowMessageModal(true)}
                className="flex items-center justify-center p-4 bg-blue-100 text-blue-700 rounded-xl font-semibold hover:bg-blue-200 transition-all"
              >
                ✉️ Send Message
              </button>
              <button
                onClick={() => setShowAppointmentModal(true)}
                className="flex items-center justify-center p-4 bg-green-100 text-green-700 rounded-xl font-semibold hover:bg-green-200 transition-all"
              >
                📅 Book Appointment
              </button>
            </div>

            {/* Bio */}
            {doctor.bio && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Qualification */}
              {doctor.qualification && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Qualification
                  </h3>
                  <p className="text-gray-700">{doctor.qualification}</p>
                </div>
              )}

              {/* Consultation Fee */}
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

              {/* Languages */}
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

              {/* Care Options */}
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

            {/* Vibe Tags */}
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

            {/* Chamber Location */}
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
                    className="inline-block mt-3 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View on Google Maps →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
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
                    setMessageForm({ ...messageForm, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    setMessageForm({ ...messageForm, message: e.target.value })
                  }
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
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
      {showAppointmentModal && (
        <div className="fixed  inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto ">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full my-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Book Appointment with {doctor.name}
            </h2>

            {/* Doctor Info Summary */}
            <div className="bg-blue-50 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Consultation Fee</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${doctor.consultationFee || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Available Options
                  </p>
                  <div className="flex gap-2">
                    {doctor.inPerson && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
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

            {/* Availability Schedule */}
            {doctor.availability && doctor.availability.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">
                  📅 Doctor's Availability
                </h3>
                <div className="bg-gray-50 rounded-2xl p-4 max-h-64 overflow-y-auto">
                  {/* Weekly Availability */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Weekly Schedule:
                    </p>
                    {doctor.availability
                      .filter((avail: any) => avail.isAvailable)
                      .map((avail: any, index: number) => (
                        <div key={index} className="mb-2 last:mb-0">
                          <p className="font-semibold text-gray-900 capitalize text-sm">
                            {avail.day}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {avail.timeSlots.map((slot: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700"
                              >
                                {slot.startTime} - {slot.endTime}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Specific Dates */}
                  {doctor.availability.some(
                    (avail: any) =>
                      avail.specificDates && avail.specificDates.length > 0
                  ) && (
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Specific Dates:
                      </p>
                      {doctor.availability
                        .flatMap((avail: any) => avail.specificDates || [])
                        .filter((sd: any) => sd.isAvailable)
                        .map((sd: any, idx: number) => (
                          <div key={idx} className="mb-2 last:mb-0">
                            <p className="font-semibold text-blue-600 text-sm">
                              {new Date(sd.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {sd.timeSlots.map((slot: any, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700"
                                >
                                  {slot.startTime} - {slot.endTime}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * Select a date below to see available time slots for that day
                </p>
              </div>
            )}

            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Appointment Date{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={appointmentForm.appointmentDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {appointmentForm.appointmentDate && (
                  <p className="text-xs text-gray-600 mt-2">
                    📅{" "}
                    {new Date(
                      appointmentForm.appointmentDate
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>

              {appointmentForm.appointmentDate &&
              availableTimeSlots.length > 0 ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Time Slot <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimeSlots.map((slot: any, idx: number) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setAppointmentForm({
                            ...appointmentForm,
                            appointmentTime: slot.startTime,
                          })
                        }
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                          appointmentForm.appointmentTime === slot.startTime
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                        }`}
                      >
                        {slot.startTime}
                      </button>
                    ))}
                  </div>
                  {appointmentForm.appointmentTime && (
                    <p className="text-xs text-green-600 mt-2">
                      ✓ Time slot selected: {appointmentForm.appointmentTime}
                    </p>
                  )}
                </div>
              ) : appointmentForm.appointmentDate ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700">
                    ❌ Doctor is not available on this date. Please select
                    another date.
                  </p>
                </div>
              ) : null}

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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
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
                          <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                            Available
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Visit the doctor at their chamber
                        </p>
                        {doctor.chamberLocation && (
                          <p className="text-xs text-gray-500 mt-1">
                            📍 {doctor.chamberLocation.city}
                          </p>
                        )}
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
                        checked={appointmentForm.appointmentType === "virtual"}
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
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                            Available
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Online video consultation from home
                        </p>
                      </div>
                    </label>
                  )}

                  {!doctor.inPerson && !doctor.telehealth && (
                    <p className="text-red-600 text-sm">
                      No appointment options available for this doctor
                    </p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Fee Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">
                    Consultation Fee:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
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
                  className="flex-1 bg-linear-to-r from-green-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Video Modal */}
      {showVideoModal && doctor.introVideo && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowVideoModal(false);
            }
          }}
        >
          <div className="max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                Intro Video - {doctor.name}
              </h2>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-white hover:text-gray-300 text-4xl font-bold w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition-all"
              >
                ×
              </button>
            </div>
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
              <video
                src={doctor.introVideo}
                controls
                autoPlay
                className="w-full max-h-[70vh]"
                onError={(e) => {
                  console.error("Video failed to load:", doctor.introVideo);
                  alert("Failed to load video. Please check the video URL.");
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="text-white text-sm mt-2 text-center">
              Click outside the video or press × to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
