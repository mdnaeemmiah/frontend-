/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { FaCalendarAlt, FaMapMarkerAlt, FaGlobe, FaShieldAlt, FaChevronDown, FaChevronUp, FaStar } from "react-icons/fa";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getDoctorById } from "@/service/matchService";
import img1 from "@/assets/img (1).png";

export default function PublicDoctorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const doctorId = params.id as string;

  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("about");

  const [appointmentForm, setAppointmentForm] = useState({
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    patientPhone: "",
    appointmentType: "in-person" as "in-person" | "virtual",
  });

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

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
        <div className="min-h-screen bg-[#2952a1] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Doctor not found
            </h2>
            <button
              onClick={() => router.push("/matches")}
              className="text-white hover:text-[#1e3d7a] font-medium"
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
      <div className="min-h-screen bg-[#2952a1] py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="text-white cursor-pointer font-medium inline-flex items-center hover:opacity-80 transition-all"
          >
            ← Back
          </button>

          {/* Header Card */}
          <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative w-48 h-48 md:w-40 md:h-40 rounded-2xl overflow-hidden flex-shrink-0 bg-blue-50">
              <Image
                src={doctor.profileImg || img1}
                alt={doctor.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{doctor.name}</h1>
                <p className="text-lg text-gray-500 font-medium">
                  {doctor.specialization} & Internal Medicine
                </p>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <span className="text-gray-900 font-bold ml-2">{doctor.rating || 4.9}</span>
                <span className="text-gray-400 text-sm ml-1">({doctor.reviewCount || 247} reviews)</span>
              </div>

              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    router.push(`/login?returnUrl=/doctors/${doctorId}`);
                  } else {
                    setShowAppointmentModal(true);
                  }
                }}
                className="bg-[#0052CC] text-white px-10 py-3.5 rounded-xl font-bold text-lg hover:bg-[#0747A6] transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Book Appointment
              </button>
            </div>
          </div>

          {/* Quick Facts Card */}
          <div className="bg-white rounded-[32px] p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Facts</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-2xl">
                  <FaCalendarAlt />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Availability</p>
                  <p className="text-sm text-gray-500">Available Today</p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Location</p>
                  <p className="text-sm text-gray-500">{doctor.city || "Downtown Medical"}</p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl">
                  <FaGlobe />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Languages</p>
                  <p className="text-sm text-gray-500">
                    {doctor.languages?.join(", ") || "English, Spanish"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center text-2xl">
                  <FaShieldAlt />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Insurance</p>
                  <p className="text-sm text-gray-500">Most Plans</p>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Information Card */}
          <div className="bg-white rounded-[32px] p-8 shadow-xl space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Doctor Information</h2>

            {/* About Section */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection("about")}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-all cursor-pointer"
              >
                <span className="text-lg font-bold text-gray-900">About {doctor.name}</span>
                {openSection === "about" ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
              </button>
              {openSection === "about" && (
                <div className="px-6 py-4 text-gray-600 leading-relaxed bg-gray-50/50">
                  <p>{doctor.bio || "Dr. Mitchell is a board-certified cardiologist with over 15 years of clinical experience in diagnosing and treating cardiovascular conditions. She specializes in preventive cardiology and patient-centered care, focusing on early detection and long-term heart health management."}</p>
                </div>
              )}
            </div>

            {/* Education Section */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection("education")}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-all cursor-pointer"
              >
                <span className="text-lg font-bold text-gray-900">Education & Certifications</span>
                {openSection === "education" ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
              </button>
              {openSection === "education" && (
                <div className="px-6 py-4 bg-gray-50/50">
                  <ul className="space-y-2 text-gray-600">
                    <li>• Doctor of Medicine (MD), Harvard Medical School</li>
                    <li>• Residency in Internal Medicine, Johns Hopkins Hospital</li>
                    <li>• Fellowship in Cardiovascular Disease, Mayo Clinic</li>
                    <li>• Board Certified in Cardiology</li>
                    <li>• Board Certified in Internal Medicine</li>
                    <li>• Advanced Cardiac Life Support (ACLS) Certified</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Services Section */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection("services")}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-all cursor-pointer"
              >
                <span className="text-lg font-bold text-gray-900">Services Offered</span>
                {openSection === "services" ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
              </button>
              {openSection === "services" && (
                <div className="px-6 py-4 bg-gray-50/50">
                  <ul className="space-y-2 text-gray-600">
                    <li>• Comprehensive cardiac evaluations</li>
                    <li>• Preventive cardiology & risk assessment</li>
                    <li>• Hypertension management</li>
                    <li>• Cholesterol management</li>
                    <li>• Stress testing (Exercise & Pharmacologic)</li>
                    <li>• Echocardiography</li>
                    <li>• Electrocardiogram (ECG/EKG)</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Patient Reviews Card */}
          <div className="bg-white rounded-[32px] p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Patient Reviews</h2>
              <button className="text-blue-600 font-bold hover:underline">View All Reviews</button>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 mb-12">
              {/* Overall Rating */}
              <div className="text-center lg:text-left space-y-2">
                <div className="text-6xl font-black text-gray-900">{doctor.rating || 4.9}</div>
                <div className="flex text-yellow-400 text-2xl justify-center lg:justify-start">
                  {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                </div>
                <div className="text-gray-500 font-medium">{doctor.reviewCount || 247} Reviews</div>
              </div>

              {/* Progress Bars */}
              <div className="flex-1 space-y-3">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-600 w-4">{star}★</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: star === 5 ? '85%' : star === 4 ? '12%' : star === 3 ? '2%' : '1%' }}
                      />
                    </div>
                    <span className="text-sm text-gray-400 w-10 text-right">
                      {star === 5 ? 210 : star === 4 ? 29 : star === 3 ? 5 : star === 2 ? 2 : 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-6">
              <div className="border border-gray-100 rounded-[24px] p-6 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden relative">
                    <Image src={img1} alt="Patient" fill className="object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">Emily R.</span>
                      <div className="flex text-yellow-400 text-xs">
                        {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">2 days ago</span>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Dr. Mitchell is exceptional! She took the time to explain my condition thoroughly and made me feel comfortable throughout the entire process. Highly recommend.
                </p>
              </div>

              <div className="border border-gray-100 rounded-[24px] p-6 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden relative">
                    <Image src={img1} alt="Patient" fill className="object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">Michael T.</span>
                      <div className="flex text-yellow-400 text-xs">
                        {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">1 week ago</span>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Outstanding care and expertise. Dr. Mitchell's preventive approach has really helped improve my heart health. The staff is also very professional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>



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
function setShowMessageModal(arg0: boolean) {
  throw new Error("Function not implemented.");
}

function setMessageForm(arg0: { subject: string; message: string; }) {
  throw new Error("Function not implemented.");
}

