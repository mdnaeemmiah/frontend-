"use client";

import { useState } from "react";
import Navigation from "../components/Navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaShieldAlt, FaCalendarAlt, FaArrowRight, FaCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import doctorHeroImage from "../assets/image/Gemini_Generated_Image_iimfv8iimfv8iimf-removebg-preview 1.svg";
import doctor1 from "../assets/close-up-portrait-happy-male-doctor.jpg";
import doctor2 from "../assets/young-woman-doctor-white-coat-with-stethoscope-making-welcoming-gesture-spreading-arms-smiling-standing-orange-wall.jpg";
import doctor3 from "../assets/young-handsome-physician-medical-robe-with-stethoscope.jpg";
import doctor4 from "../assets/cinematic-portrait-woman-working-healthcare-system-having-care-job.jpg";
import hero from "../assets/hero.jpg";
import Link from "next/link";
import img1 from "../assets/image/div.svg";
import img2 from "../assets/image/image 1.svg";
import img3 from "../assets/image/image 3.svg";
import img4 from "../assets/image/image 4.svg";
import img5 from "../assets/image/image 5.svg";
import img6 from "../assets/image/image 6.svg";
import imgFooter1 from "../assets/image/Vector.svg";
import imgFooter2 from "../assets/image/attachment__2_-removebg-preview 1.svg";

export default function Home() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(1);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const services = [
    {
      icon: img2,
      title: "Virtual Consultation",
      description:
        "Connect with doctors from the comfort of your home through secure video calls.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: img1,
      title: "Easy Scheduling",
      description:
        "Book appointments instantly with real-time availability and automated reminders.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: img3,
      title: "Health Records",
      description:
        "Access your complete medical history and test results anytime, anywhere.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: img4,
      title: "Prescription Management",
      description:
        "Get digital prescriptions and track your medications with ease.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: img5,
      title: "Result Monitoring",
      description:
        "Track your health metrics and receive insights from your healthcare team.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: img6,
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
      name: "Dr. Sarah Mitchell",
      specialty: "Family Medicine",
      rating: 4.9,
      reviews: 248,
      image: doctor1,
    },
    {
      id: "doc_002",
      name: "Dr. James Chen",
      specialty: "Cardiology",
      rating: 4.8,
      reviews: 312,
      image: doctor2,
    },
    {
      id: "doc_003",
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrics",
      rating: 5.0,
      reviews: 427,
      image: doctor3,
    },
    {
      id: "doc_004",
      name: "Dr. Michael Turner",
      specialty: "Dermatology",
      rating: 4.9,
      reviews: 189,
      image: doctor4,
    },
  ];

  const testimonials = [
    {
      text: "The care I received was exceptional. The staff was professional, caring, and made me feel comfortable throughout my treatment. I couldn't be happier with the results.",
      author: "Sarah Chen",
      role: "Teacher",
      rating: 5,
      image: doctor4,
    },
    {
      text: "Outstanding medical expertise combined with genuine compassion. The team went above and beyond to ensure my recovery was smooth and comfortable. Highly recommend!",
      author: "Michael Lee",
      role: "Engineer",
      rating: 5,
      image: doctor2,
    },
    {
      text: "From the initial consultation to follow-up care, everything was handled with utmost professionalism. The facility is modern and the staff truly cares about patient well-being.",
      author: "Emily Rodriguez",
      role: "Marketing Director",
      rating: 5,
      image: doctor3,
    },
    {
      text: "The care I received was exceptional. The staff was professional, caring, and made me feel comfortable throughout my treatment. I couldn't be happier with the results.",
      author: "Sarah Chen",
      role: "Teacher",
      rating: 5,
      image: img1,
    },
    {
      text: "Outstanding medical expertise combined with genuine compassion. The team went above and beyond to ensure my recovery was smooth and comfortable. Highly recommend!",
      author: "Michael Lee",
      role: "Engineer",
      rating: 5,
      image: img2,
    },
    {
      text: "From the initial consultation to follow-up care, everything was handled with utmost professionalism. The facility is modern and the staff truly cares about patient well-being.",
      author: "Emily Rodriguez",
      role: "Marketing Director",
      rating: 5,
      image: img3,
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
      <section className="relative overflow-hidden bg-[#2952A1] ">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 text-white pb-20">
              <h1 className="text-5xl text-[#FEF3E2] lg:text-7xl font-sans font-bold leading-tight">
                Your Health Journey,<br />
                Simplified
              </h1>

              <p className="text-xl opacity-90 max-w-xl leading-relaxed font-sans">
                Connect with trusted healthcare providers, manage appointments, and access your
                medical records—all in one secure, easy-to-use platform.
              </p>

              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="bg-white p-1 rounded-full text-[#2952A1]">
                    <FaCheck className="text-[10px]" />
                  </div>
                  <span className="font-sans font-medium">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-white text-xl" />
                  <span className="font-sans font-medium">Secure & Private</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => router.push("/onboarding")}
                  className="px-10 bg-[#FEF3E2] text-[#2952A1] py-4  border-2 border-white  rounded-[40px] font-bold text-lg hover:bg-white hover:text-black duration-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Book Appointment
                </button>
                <button
                  onClick={() => {
                    const faqSection = document.getElementById("faq-section");
                    faqSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-10 bg-[#FEF3E2] text-[#2952A1] py-4  border-2 border-white  rounded-[40px] font-bold text-lg hover:bg-white hover:text-black duration-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Learn More <FaArrowRight className="text-sm" />
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative flex justify-center lg:justify-end items-end h-full">
              <div className="relative w-full max-w-[600px]">
                <Image
                  src={doctorHeroImage}
                  alt="Healthcare Professional"
                  className="w-full h-auto relative z-10"
                  priority
                />

                {/* Floating Cards */}
                {/* 500+ Card */}
                <div className="absolute top-[40%] right-0 lg:-right-10 bg-[#E3EDF7] rounded-2xl p-6 shadow-xl z-20 flex flex-col items-center min-w-[170px] text-center border border-white/50">
                  <p className="text-4xl font-bold text-slate-900">500+</p>
                  <p className="text-lg text-slate-600 font-medium">Mbbs Doctor</p>
                </div>

                {/* Next Appointment Card */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 lg:-left-20 bg-white rounded-2xl p-5 shadow-2xl z-20 flex items-center gap-4 min-w-[240px] border border-gray-100">
                  <div className="w-14 h-14 bg-[#0061BC] rounded-xl flex items-center justify-center">
                    <FaCalendarAlt className="text-white text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Next Appointment</p>
                    <p className="text-lg font-bold text-gray-900">Today at 2:30 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-[#2952A1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-[#FEF3E2] mb-4">
              Comprehensive Care at Your Fingertips
            </h2>
            <p className="text-xl text-[#FEF3E2] max-w-3xl mx-auto">
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
                  className={`w-20 h-20 ${service.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={48}
                    height={48}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
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
      <section className="py-20 bg-[#2952A1] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 underline-offset-8">
            <h2 className="text-5xl font-bold text-white mb-4">
              Meet Our Healthcare Providers
            </h2>
            <p className="text-xl text-white/90">
              Experienced, compassionate professionals dedicated to your wellbeing
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Dotted Connection Line with Diamonds (Desktop only) */}
            <div className="hidden lg:block absolute top-[45%] left-0 w-full h-px border-b-2 border-dashed border-[#3B82F6] opacity-30 z-0"></div>
            <div className="hidden lg:flex absolute top-[45%] left-0 w-full justify-around -translate-y-1/2 z-0 px-12">
              <div className="w-3 h-3 bg-[#3B82F6] rotate-45 opacity-40 invisible"></div>
              <div className="w-3 h-3 bg-[#3B82F6] rotate-45 opacity-40"></div>
              <div className="w-3 h-3 bg-[#3B82F6] rotate-45 opacity-40"></div>
              <div className="w-3 h-3 bg-[#3B82F6] rotate-45 opacity-40"></div>
            </div>

            {doctors.map((doctor, index) => (
              <div
                key={index}
                className="bg-[#F9F9F7] rounded-[32px] p-4 shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group z-10"
              >
                <div className="relative h-60 w-full mb-6 overflow-hidden rounded-2xl">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="px-2 pb-4">
                  <h3 className="text-xl font-bold text-[#1F2937] mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-[#22C55E] font-medium text-sm mb-3">
                    {doctor.specialty}
                  </p>
                  <div className="flex items-center gap-1 mb-6">
                    <div className="flex text-[#FBBF24] gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-xl font-semibold ">★</span>
                      ))}
                    </div>
                    <span className="text-gray-400 text-xs ml-1">
                      ({doctor.reviews} reviews)
                    </span>
                  </div>
                  <button
                    onClick={() => router.push(`/doctors/${doctor.id}`)}
                    className="w-full cursor-pointer px-6 py-3.5 bg-[#0052CC] text-white rounded-2xl font-bold text-sm hover:bg-[#0747A6] transition-all shadow-md"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button
              onClick={() => router.push("/search-doctors")}
              className="px-10 py-4 bg-white text-[#0084FF] rounded-full font-bold text-lg hover:bg-gray-50 transition-all shadow-lg cursor-pointer"
            >
              View All Providers
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-[#2952A1] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 underline-offset-8">
            <h2 className="text-5xl font-bold text-white mb-4">
              What Our Patients Say
            </h2>
            <p className="text-xl text-white/90">
              Real experiences from people who trust us with their health
            </p>
          </div>
          <div className="relative">
            {/* Carousel Content */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 min-h-[480px]">
              {/* Left Arrow */}
              <button
                onClick={prevTestimonial}
                className="absolute left-0 lg:-left-20 z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#14B8A6] shadow-xl hover:bg-teal-50 transition-all cursor-pointer"
              >
                <FaChevronLeft className="text-xl" />
              </button>

              {/* Cards Container */}
              <div className="flex items-center justify-center gap-4 lg:gap-10 w-full overflow-visible py-10">
                {testimonials.map((testimonial, index) => {
                  const isCenter = index === currentTestimonial;
                  const isLeft = index === (currentTestimonial - 1 + testimonials.length) % testimonials.length;
                  const isRight = index === (currentTestimonial + 1) % testimonials.length;

                  if (!isCenter && !isLeft && !isRight) return null;

                  return (
                    <div
                      key={index}
                      className={`bg-white rounded-[32px] p-8 shadow-2xl transition-all duration-500 flex flex-col items-center
                        ${isCenter ? 'scale-105 z-10 w-full max-w-sm md:max-w-md opacity-100' : 'hidden lg:flex w-full max-w-xs opacity-50 scale-90'}
                      `}
                    >
                      <div className="flex items-center gap-4 mb-8 w-full">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-teal-100">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.author}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="text-left">
                          <h4 className="text-xl font-bold text-[#14B8A6] leading-tight">{testimonial.author}</h4>
                          <p className="text-[#1E3A8A] font-semibold text-sm">{testimonial.role}</p>
                        </div>
                      </div>

                      <p className="text-gray-600 leading-relaxed mb-8 text-base font-medium">
                        "{testimonial.text}"
                      </p>

                      <div className="flex gap-1.5 mt-auto">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-[#FBBF24] text-2xl">★</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Arrow */}
              <button
                onClick={nextTestimonial}
                className="absolute right-0 lg:-right-20 z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#14B8A6] shadow-xl hover:bg-teal-50 transition-all cursor-pointer"
              >
                <FaChevronRight className="text-xl" />
              </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-3 mt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${index === currentTestimonial ? 'bg-[#FEF9C3] w-6' : 'bg-white/30'
                    }`}
                />
              ))}
            </div>
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
              className="px-10 bg-[#FEF3E2] text-[#2952A1] py-4  border-2 border-white  rounded-[40px] font-bold text-lg hover:bg-white hover:text-black duration-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Create  Free Account
            </button>
            <button
              onClick={() => router.push("/login")}
              className="px-10 bg-[#FEF3E2] text-[#2952A1] py-4  border-2 border-white  rounded-[40px] font-bold text-lg hover:bg-white hover:text-black duration-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Schedule a Demo
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
      <section id="faq-section" className="py-20 bg-[#2952A1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-[#FEF3E2] mb-4">
              Frequently <span className="text-white">Asked Questions</span>
            </h2>
            <p className="text-xl text-white/80">
              Everything you need to know about NovaHealth
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div
                key={index}
                className="bg-[#E5E7EB] rounded-2xl border-2 border-[#2952a1]/20 overflow-hidden hover:border-[#2952a1]/50 transition-all shadow-sm"
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

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#012d61] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Nova Health Column */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                  <Image
                    src={imgFooter1}
                    alt="Nova Health Logo"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <Image
                  src={imgFooter2}
                  alt="Nova Health Footer Image"
                  width={100}
                  height={40}
                  className="object-contain h-[42px] w-auto"
                />
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
