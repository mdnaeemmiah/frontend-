"use client";

import { useState } from "react";
import Navigation from "../components/Navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import doctorHeroImage from "../assets/div.png";
import doctor1 from "../assets/close-up-portrait-happy-male-doctor.jpg";
import doctor2 from "../assets/young-woman-doctor-white-coat-with-stethoscope-making-welcoming-gesture-spreading-arms-smiling-standing-orange-wall.jpg";
import doctor3 from "../assets/young-handsome-physician-medical-robe-with-stethoscope.jpg";
import doctor4 from "../assets/cinematic-portrait-woman-working-healthcare-system-having-care-job.jpg";
import hero from "../assets/hero.jpg";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const services = [
    {
      icon: "🎥",
      title: "Virtual Consultation",
      description:
        "Connect with doctors from the comfort of your home through secure video calls.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: "📅",
      title: "Easy Scheduling",
      description:
        "Book appointments instantly with real-time availability and automated reminders.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: "📋",
      title: "Health Records",
      description:
        "Access your complete medical history and test results anytime, anywhere.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: "💊",
      title: "Prescription Management",
      description:
        "Get digital prescriptions and track your medications with ease.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: "📊",
      title: "Result Monitoring",
      description:
        "Track your health metrics and receive insights from your healthcare team.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: "💬",
      title: "Secure Messaging",
      description:
        "Communicate directly with your doctor through our encrypted messaging system.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
  ];

  const doctors = [
    {
      id: "doc_001",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      rating: 4.9,
      reviews: 127,
      image: doctor1,
    },
    {
      id: "doc_002",
      name: "Dr. Michael Chen",
      specialty: "Pediatrician",
      rating: 4.8,
      reviews: 203,
      image: doctor2,
    },
    {
      id: "doc_003",
      name: "Dr. Emily Rodriguez",
      specialty: "Dermatologist",
      rating: 5.0,
      reviews: 156,
      image: doctor3,
    },
    {
      id: "doc_004",
      name: "Dr. James Wilson",
      specialty: "Orthopedic",
      rating: 4.9,
      reviews: 189,
      image: doctor4,
    },
  ];

  const testimonials = [
    {
      text: "NovaHealth made it so easy to find the right doctor for me. The video introductions helped me feel comfortable before my first appointment.",
      author: "Jessica Thompson",
      role: "Patient",
      rating: 5,
    },
    {
      text: "I love how I can book appointments online and get reminders. The virtual consultation feature is a game-changer for busy parents!",
      author: "Mark Anderson",
      role: "Parent",
      rating: 5,
    },
    {
      text: "The health records feature keeps everything organized. I can easily share my medical history with new doctors without hassle.",
      author: "Lisa Martinez",
      role: "Patient",
      rating: 5,
    },
  ];

  const faqData = [
    {
      question: "What is NovaHealth?",
      answer:
        "NovaHealth is a healthcare platform that connects patients with verified doctors. We help you find the right healthcare provider based on your needs, preferences, and communication style through personalized matching.",
    },
    {
      question: "How does the doctor matching work?",
      answer:
        "Our AI-powered system analyzes your preferences, health needs, and communication style to recommend doctors who are the best fit for you. You can view doctor profiles, watch intro videos, and book appointments directly through our platform.",
    },
    {
      question: "Is NovaHealth free to use?",
      answer:
        "Yes! Creating an account and browsing doctors is completely free. You only pay the consultation fee directly to your chosen healthcare provider when you book an appointment.",
    },
    {
      question: "Are the doctors verified?",
      answer:
        "Absolutely. All doctors on our platform are verified healthcare professionals with valid licenses. We thoroughly vet each provider to ensure they meet our quality standards.",
    },
    {
      question: "Can I have virtual consultations?",
      answer:
        "Yes! Many of our doctors offer virtual consultations through secure video calls. You can filter doctors by consultation type (virtual or in-person) when searching.",
    },
    {
      question: "How do I book an appointment?",
      answer:
        "Simply browse or search for doctors, view their profiles and availability, then select a time slot that works for you. You'll receive confirmation and reminders via email and SMS.",
    },
    {
      question: "Is my health information secure?",
      answer:
        "Yes. We are HIPAA compliant and use industry-standard encryption to protect your personal and health information. Your data is never shared without your explicit consent.",
    },
    {
      question: "Can I cancel or reschedule appointments?",
      answer:
        "Yes, you can cancel or reschedule appointments through your patient dashboard. Please note that cancellation policies may vary by doctor, so check their specific policy before booking.",
    },
  ];

  const toggleQuestion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={hero}
            alt="Healthcare Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-white/80"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                <span className="text-green-700 text-sm font-medium">
                  ✨ Trusted by 10,000+ patients
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Health Journey,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2952a1] to-[#1e3d7a]">
                  Simplified
                </span>
              </h1>

              <p className="text-xl text-white leading-relaxed">
                Connect with healthcare providers who truly understand you. Get
                personalized doctor recommendations based on your needs,
                preferences, and communication style.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push("/onboarding")}
                  className="px-8 py-4 bg-gradient-to-r text-xl text-black hover:text-white rounded-xl font-semibold hover:from-[#1e3d7a] hover:to-[#2952a1] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-[#2952a1] border-2 cursor-pointer"
                >
                  Get Started
                </button>
                <button
                  onClick={() => {
                    const faqSection = document.getElementById("faq-section");
                    faqSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-8 py-4 bg-gradient-to-r text-xl  text-black hover:text-white rounded-xl font-semibold hover:from-[#1e3d7a] hover:to-[#2952a1] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-[#2952a1] border-2 cursor-pointer"
                >
                  Learn More
                </button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500 text-2xl" />
                  <span className="text-black font-medium">
                    HIPAA Compliant
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500 text-2xl" />
                  <span className="text-black  font-medium">
                    Secure & Private
                  </span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative bg-white rounded-3xl shadow-2xl">
                <Image
                  src={doctorHeroImage}
                  alt="Healthcare Professional"
                  className="w-full h-auto"
                  priority
                />
                <div className="absolute bottom-6 left-6 bg-white rounded-2xl p-4 shadow-xl hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xl">✓</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">500+</p>
                      <p className="text-sm text-gray-600">Verified Doctors</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Care at Your Fingertips
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience healthcare the way it should be - personalized,
              accessible, and human-centered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-[#E8F4F8]  group-hover:scale-110 transition-transform duration-300 rounded-2xl p-8 shadow-md hover:shadow-2xl  duration-300 border border-gray-200 hover:border-[#2952a1]/50 group hover:-translate-y-2 cursor-pointer hover:bg-white"
              >
                <div
                  className={`w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#2952a1] transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4 group-hover:text-gray-700 transition-colors duration-300">
                  {service.description}
                </p>
                <button className="text-[#2952a1] font-semibold hover:text-[#1e3d7a] flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                  Learn More
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Healthcare Providers
            </h2>
            <p className="text-xl text-gray-600">
              Experienced professionals dedicated to your wellbeing
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {doctors.map((doctor, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-[#2952a1]/30 cursor-pointer group"
              >
                <div className="relative h-64 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-gray-600 mb-3">{doctor.specialty}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="font-semibold text-gray-900">
                        {doctor.rating}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({doctor.reviews})
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/doctors/${doctor.id}`)}
                    className="w-full cursor-pointer px-4 py-3 bg-[#2952a1] text-white rounded-xl font-semibold hover:bg-[#1e3d7a] transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => router.push("/search-doctors")}
              className="px-8 cursor-pointer py-4 bg-white text-[#2952a1] border-2 border-[#2952a1] rounded-xl font-semibold hover:bg-[#ebe2cd]/30 transition-all"
            >
              View All Doctors
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from our satisfied patients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-[#2952a1] hover:-translate-y-2 cursor-pointer hover:scale-105"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2952a1] to-[#1e3d7a] rounded-full flex items-center justify-center text-white font-bold hover:scale-110 transition-transform duration-300">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#2952a1] to-[#1e3d7a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto">
            Join thousands of patients who found their perfect healthcare match.
            Get personalized doctor recommendations in minutes.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => router.push("/onboarding")}
              className="px-10 py-4 bg-white text-[#2952a1] rounded-xl font-semibold hover:bg-[#ebe2cd] transition-all shadow-xl"
            >
              Get Started Now
            </button>
            <button
              onClick={() => router.push("/login")}
              className="px-10 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              Sign In
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div>
              <p className="text-4xl font-bold text-white mb-2">500+</p>
              <p className="text-white/80">Doctors</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-2">1,500+</p>
              <p className="text-white/80">Appointments</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-2">98%</p>
              <p className="text-white/80">Satisfaction</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-2">24/7</p>
              <p className="text-white/80">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently <span className="text-[#2952a1]">Asked Questions</span>
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about NovaHealth
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div
                key={index}
                className="bg-[#ebe2cd]/30 rounded-2xl border-2 border-[#2952a1]/20 overflow-hidden hover:border-[#2952a1]/50 transition-all shadow-sm"
              >
                <button
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-[#ebe2cd]/50 transition-colors"
                  onClick={() => toggleQuestion(index)}
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-8">
                    {item.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {activeIndex === index ? (
                      <svg
                        className="w-6 h-6 text-[#2952a1]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6 text-[#2952a1]/60"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </div>
                </button>
                {activeIndex === index && (
                  <div className="px-6 pb-6 bg-white/50">
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] text-white rounded-xl font-semibold hover:from-[#1e3d7a] hover:to-[#2952a1] transition-all shadow-lg"
            >
              Contact Support
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2952a1] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Nova Health Column */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-[#2952a1] text-2xl">❤️</span>
                </div>
                <h3 className="text-2xl font-bold">Nova Health</h3>
              </div>
              <p className="text-white/80 mb-6 leading-relaxed">
                His Footer Text Ties Directly To Your Portfolio's Theme Of
                Creative + Technical Expertise While Giving Visitors A Way To
                Connect With You
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-11 h-11 bg-[#FF6B4A] rounded-full flex items-center justify-center hover:bg-[#FF5533] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-11 h-11 bg-[#FF6B4A] rounded-full flex items-center justify-center hover:bg-[#FF5533] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-11 h-11 bg-[#FF6B4A] rounded-full flex items-center justify-center hover:bg-[#FF5533] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* For Patients Column */}
            <div>
              <h4 className="text-xl font-bold mb-6 border-b-2 border-[#ebe2cd] pb-2 inline-block">
                For Patients
              </h4>
              <ul className="space-y-3 text-white/80">
                <li>
                  <a
                    href="/search-doctors"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Find A Doctor
                  </a>
                </li>
                <li>
                  <a
                    href="/onboarding"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="/matches"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Browse Specialties
                  </a>
                </li>
                <li>
                  <a
                    href="/patient/appointments"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Patient Reviews
                  </a>
                </li>
              </ul>
            </div>

            {/* For Doctors Column */}
            <div>
              <h4 className="text-xl font-bold mb-6 border-b-2 border-[#ebe2cd] pb-2 inline-block">
                For Doctors
              </h4>
              <ul className="space-y-3 text-white/80">
                <li>
                  <a
                    href="/signup"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Join CareMatch
                  </a>
                </li>
                <li>
                  <Link
                    href="/doctor/dashboard"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/doctor/profile"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/doctor/appointments"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Resources
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-xl font-bold mb-6 border-b-2 border-[#ebe2cd] pb-2 inline-block">
                Company
              </h4>
              <ul className="space-y-3 text-white/80">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Terms Of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#ebe2cd]/30 mt-12 pt-8 text-center text-white/80">
            <p>&copy; 2026 NovaHealth. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
