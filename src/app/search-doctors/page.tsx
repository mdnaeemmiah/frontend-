/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDoctorsFromAssets } from "@/service/matchService";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

// Extended fake doctors data
const EXTENDED_DOCTORS = [
  {
    _id: "doc_005",
    name: "Dr. Sarah Mitchell",
    specialization: "Mental Health Care",
    profileImg: "https://i.pravatar.cc/150?img=1",
    errorImg: "/assets/div.png",
    bio: "Psychiatrist specializing in anxiety and depression treatment.",
    languages: ["English", "Spanish"],
    vibeTags: ["Compassionate", "Supportive", "Patient"],
    rating: 4.9,
    reviewCount: 203,
    experience: 12,
    consultationFee: 95,
    city: "New York",
    chamberLocation: {
      address: "Mental Health Center, Manhattan",
      city: "New York",
      zipCode: "10001",
      googleMapsUrl: "https://maps.google.com/?q=mental+health+ny",
    },
    telehealth: true,
    inPerson: true,
  },
  {
    _id: "doc_006",
    name: "Dr. James Anderson",
    specialization: "Mental Health Care",
    profileImg: "https://i.pravatar.cc/150?img=2",
    errorImg: "/assets/div (2).png",
    bio: "Clinical psychologist with expertise in cognitive behavioral therapy.",
    languages: ["English"],
    vibeTags: ["Expert", "Analytical", "Thorough"],
    rating: 4.8,
    reviewCount: 187,
    experience: 15,
    consultationFee: 100,
    city: "Los Angeles",
    chamberLocation: {
      address: "Psychology Associates, LA",
      city: "Los Angeles",
      zipCode: "90001",
      googleMapsUrl: "https://maps.google.com/?q=psychology+la",
    },
    telehealth: true,
    inPerson: false,
  },
  {
    _id: "doc_007",
    name: "Dr. Emily Roberts",
    specialization: "Mental Health Care",
    profileImg: "https://i.pravatar.cc/150?img=3",
    errorImg: "/assets/div (3).png",
    bio: "Licensed therapist specializing in family and couples counseling.",
    languages: ["English", "French"],
    vibeTags: ["Empathetic", "Caring", "Supportive"],
    rating: 4.7,
    reviewCount: 156,
    experience: 10,
    consultationFee: 85,
    city: "Chicago",
    chamberLocation: {
      address: "Wellness Center, Chicago",
      city: "Chicago",
      zipCode: "60601",
      googleMapsUrl: "https://maps.google.com/?q=wellness+chicago",
    },
    telehealth: true,
    inPerson: true,
  },
  {
    _id: "doc_008",
    name: "Dr. Lisa Chen",
    specialization: "Acupuncture",
    profileImg: "https://i.pravatar.cc/150?img=4",
    errorImg: "/assets/div (4).png",
    bio: "Licensed acupuncturist with 20 years of traditional medicine experience.",
    languages: ["English", "Mandarin"],
    vibeTags: ["Holistic", "Experienced", "Gentle"],
    rating: 4.9,
    reviewCount: 165,
    experience: 20,
    consultationFee: 75,
    city: "San Francisco",
    chamberLocation: {
      address: "Acupuncture Clinic, SF",
      city: "San Francisco",
      zipCode: "94102",
      googleMapsUrl: "https://maps.google.com/?q=acupuncture+sf",
    },
    telehealth: false,
    inPerson: true,
  },
  {
    _id: "doc_009",
    name: "Dr. Michael Zhang",
    specialization: "Acupuncture",
    profileImg: "https://i.pravatar.cc/150?img=5",
    errorImg: "/assets/div.png",
    bio: "Traditional Chinese medicine practitioner specializing in pain management.",
    languages: ["English", "Mandarin", "Cantonese"],
    vibeTags: ["Traditional", "Skilled", "Holistic"],
    rating: 4.8,
    reviewCount: 142,
    experience: 18,
    consultationFee: 80,
    city: "Seattle",
    chamberLocation: {
      address: "TCM Wellness, Seattle",
      city: "Seattle",
      zipCode: "98101",
      googleMapsUrl: "https://maps.google.com/?q=tcm+seattle",
    },
    telehealth: false,
    inPerson: true,
  },
  {
    _id: "doc_010",
    name: "Dr. Rachel Kim",
    specialization: "Acupuncture",
    profileImg: "https://i.pravatar.cc/150?img=6",
    errorImg: "/assets/div (2).png",
    bio: "Holistic acupuncturist focusing on wellness and preventive care.",
    languages: ["English", "Korean"],
    vibeTags: ["Holistic", "Preventive", "Caring"],
    rating: 4.7,
    reviewCount: 128,
    experience: 12,
    consultationFee: 70,
    city: "Boston",
    chamberLocation: {
      address: "Holistic Health Center, Boston",
      city: "Boston",
      zipCode: "02101",
      googleMapsUrl: "https://maps.google.com/?q=holistic+boston",
    },
    telehealth: false,
    inPerson: true,
  },
  {
    _id: "doc_011",
    name: "Dr. David Thompson",
    specialization: "Dental Care",
    profileImg: "https://i.pravatar.cc/150?img=7",
    errorImg: "/assets/div (3).png",
    bio: "General dentist with expertise in cosmetic and restorative dentistry.",
    languages: ["English"],
    vibeTags: ["Skilled", "Friendly", "Professional"],
    rating: 4.9,
    reviewCount: 212,
    experience: 20,
    consultationFee: 120,
    city: "Miami",
    chamberLocation: {
      address: "Dental Excellence, Miami",
      city: "Miami",
      zipCode: "33101",
      googleMapsUrl: "https://maps.google.com/?q=dental+miami",
    },
    telehealth: false,
    inPerson: true,
  },
  {
    _id: "doc_012",
    name: "Dr. Jennifer Lee",
    specialization: "Dental Care",
    profileImg: "https://i.pravatar.cc/150?img=8",
    errorImg: "/assets/div (4).png",
    bio: "Orthodontist specializing in braces and clear aligners.",
    languages: ["English", "Vietnamese"],
    vibeTags: ["Precise", "Modern", "Patient-focused"],
    rating: 4.8,
    reviewCount: 178,
    experience: 14,
    consultationFee: 150,
    city: "Dallas",
    chamberLocation: {
      address: "Orthodontic Specialists, Dallas",
      city: "Dallas",
      zipCode: "75201",
      googleMapsUrl: "https://maps.google.com/?q=orthodontics+dallas",
    },
    telehealth: false,
    inPerson: true,
  },
  {
    _id: "doc_013",
    name: "Dr. Marcus Johnson",
    specialization: "Mental Health Care",
    profileImg: "https://i.pravatar.cc/150?img=9",
    errorImg: "/assets/div.png",
    bio: "Behavioral health specialist with focus on addiction recovery.",
    languages: ["English"],
    vibeTags: ["Supportive", "Dedicated", "Compassionate"],
    rating: 4.8,
    reviewCount: 195,
    experience: 16,
    consultationFee: 105,
    city: "Denver",
    chamberLocation: {
      address: "Recovery Center, Denver",
      city: "Denver",
      zipCode: "80202",
      googleMapsUrl: "https://maps.google.com/?q=recovery+denver",
    },
    telehealth: true,
    inPerson: true,
  },
  {
    _id: "doc_014",
    name: "Dr. Patricia Wong",
    specialization: "Mental Health Care",
    profileImg: "https://i.pravatar.cc/150?img=10",
    errorImg: "/assets/div (2).png",
    bio: "Child and adolescent psychiatrist with specialized trauma training.",
    languages: ["English", "Mandarin"],
    vibeTags: ["Caring", "Specialized", "Patient"],
    rating: 4.9,
    reviewCount: 167,
    experience: 13,
    consultationFee: 110,
    city: "Portland",
    chamberLocation: {
      address: "Child Wellness Center, Portland",
      city: "Portland",
      zipCode: "97201",
      googleMapsUrl: "https://maps.google.com/?q=child+wellness+portland",
    },
    telehealth: true,
    inPerson: true,
  },
  {
    _id: "doc_015",
    name: "Dr. Thomas Brown",
    specialization: "Acupuncture",
    profileImg: "https://i.pravatar.cc/150?img=11",
    errorImg: "/assets/div (3).png",
    bio: "Sports acupuncturist specializing in athletic injury recovery.",
    languages: ["English"],
    vibeTags: ["Athletic", "Skilled", "Effective"],
    rating: 4.8,
    reviewCount: 134,
    experience: 14,
    consultationFee: 85,
    city: "Austin",
    chamberLocation: {
      address: "Sports Medicine Clinic, Austin",
      city: "Austin",
      zipCode: "78701",
      googleMapsUrl: "https://maps.google.com/?q=sports+medicine+austin",
    },
    telehealth: false,
    inPerson: true,
  },
  {
    _id: "doc_016",
    name: "Dr. Angela Martinez",
    specialization: "Acupuncture",
    profileImg: "https://i.pravatar.cc/150?img=12",
    errorImg: "/assets/div (4).png",
    bio: "Fertility acupuncturist helping couples with conception.",
    languages: ["English", "Spanish"],
    vibeTags: ["Specialized", "Compassionate", "Holistic"],
    rating: 4.9,
    reviewCount: 156,
    experience: 11,
    consultationFee: 90,
    city: "Phoenix",
    chamberLocation: {
      address: "Fertility Wellness, Phoenix",
      city: "Phoenix",
      zipCode: "85001",
      googleMapsUrl: "https://maps.google.com/?q=fertility+phoenix",
    },
    telehealth: false,
    inPerson: true,
  },
  {
    _id: "doc_017",
    name: "Dr. Robert Garcia",
    specialization: "Dental Care",
    profileImg: "https://i.pravatar.cc/150?img=13",
    errorImg: "/assets/div.png",
    bio: "Periodontist specializing in gum disease and implants.",
    languages: ["English", "Spanish"],
    vibeTags: ["Expert", "Thorough", "Professional"],
    rating: 4.8,
    reviewCount: 189,
    experience: 18,
    consultationFee: 140,
    city: "Houston",
    chamberLocation: {
      address: "Periodontal Specialists, Houston",
      city: "Houston",
      zipCode: "77001",
      googleMapsUrl: "https://maps.google.com/?q=periodontal+houston",
    },
    telehealth: false,
    inPerson: true,
  },
  {
    _id: "doc_019",
    name: "Dr. William Martinez",
    specialization: "Cardiologist",
    profileImg: "https://i.pravatar.cc/150?img=15",
    errorImg: "/assets/div (3).png",
    bio: "Interventional cardiologist specializing in heart disease treatment and prevention.",
    languages: ["English", "Spanish"],
    vibeTags: ["Expert", "Compassionate", "Thorough"],
    rating: 4.9,
    reviewCount: 198,
    experience: 17,
    consultationFee: 110,
    city: "San Diego",
    chamberLocation: {
      address: "Cardiac Care Center, San Diego",
      city: "San Diego",
      zipCode: "92101",
      googleMapsUrl: "https://maps.google.com/?q=cardiac+san+diego",
    },
    telehealth: true,
    inPerson: true,
  },
  {
    _id: "doc_020",
    name: "Dr. Victoria Anderson",
    specialization: "Cardiologist",
    profileImg: "https://i.pravatar.cc/150?img=16",
    errorImg: "/assets/div (4).png",
    bio: "Women's heart health specialist with focus on cardiovascular disease in women.",
    languages: ["English"],
    vibeTags: ["Specialized", "Caring", "Knowledgeable"],
    rating: 4.8,
    reviewCount: 176,
    experience: 14,
    consultationFee: 105,
    city: "Atlanta",
    chamberLocation: {
      address: "Women's Cardiac Health, Atlanta",
      city: "Atlanta",
      zipCode: "30303",
      googleMapsUrl: "https://maps.google.com/?q=womens+cardiac+atlanta",
    },
    telehealth: true,
    inPerson: true,
  },
  {
    _id: "doc_021",
    name: "Dr. James Wilson",
    specialization: "Orthopedic Surgeon",
    profileImg: "https://i.pravatar.cc/150?img=17",
    errorImg: "/assets/div.png",
    bio: "Sports medicine orthopedic surgeon specializing in knee and shoulder injuries.",
    languages: ["English"],
    vibeTags: ["Athletic", "Skilled", "Innovative"],
    rating: 4.9,
    reviewCount: 203,
    experience: 16,
    consultationFee: 130,
    city: "Denver",
    chamberLocation: {
      address: "Sports Orthopedics, Denver",
      city: "Denver",
      zipCode: "80202",
      googleMapsUrl: "https://maps.google.com/?q=sports+orthopedics+denver",
    },
    telehealth: false,
    inPerson: true,
  },
  {
    _id: "doc_022",
    name: "Dr. Amanda Rodriguez",
    specialization: "Orthopedic Surgeon",
    profileImg: "https://i.pravatar.cc/150?img=18",
    errorImg: "/assets/div (2).png",
    bio: "Pediatric orthopedic surgeon treating children's bone and joint conditions.",
    languages: ["English", "Spanish"],
    vibeTags: ["Gentle", "Expert", "Patient"],
    rating: 4.8,
    reviewCount: 187,
    experience: 13,
    consultationFee: 125,
    city: "Tampa",
    chamberLocation: {
      address: "Children's Orthopedics, Tampa",
      city: "Tampa",
      zipCode: "33602",
      googleMapsUrl: "https://maps.google.com/?q=childrens+orthopedics+tampa",
    },
    telehealth: false,
    inPerson: true,
  },
  {
    _id: "doc_023",
    name: "Dr. Robert Taylor",
    specialization: "Family Medicine",
    profileImg: "https://i.pravatar.cc/150?img=19",
    errorImg: "/assets/div (3).png",
    bio: "Family physician providing comprehensive care for all ages.",
    languages: ["English"],
    vibeTags: ["Caring", "Thorough", "Approachable"],
    rating: 4.7,
    reviewCount: 165,
    experience: 11,
    consultationFee: 85,
    city: "Nashville",
    chamberLocation: {
      address: "Family Health Center, Nashville",
      city: "Nashville",
      zipCode: "37201",
      googleMapsUrl: "https://maps.google.com/?q=family+health+nashville",
    },
    telehealth: true,
    inPerson: true,
  },
  {
    _id: "doc_024",
    name: "Dr. Maria Santos",
    specialization: "Family Medicine",
    profileImg: "https://i.pravatar.cc/150?img=20",
    errorImg: "/assets/div (4).png",
    bio: "Bilingual family doctor specializing in preventive care and chronic disease management.",
    languages: ["English", "Spanish"],
    vibeTags: ["Bilingual", "Preventive", "Holistic"],
    rating: 4.8,
    reviewCount: 192,
    experience: 9,
    consultationFee: 80,
    city: "San Antonio",
    chamberLocation: {
      address: "Community Health Clinic, San Antonio",
      city: "San Antonio",
      zipCode: "78201",
      googleMapsUrl: "https://maps.google.com/?q=community+health+san+antonio",
    },
    telehealth: true,
    inPerson: true,
  },
  {
    _id: "doc_025",
    name: "Dr. Christopher Lee",
    specialization: "Neurologist",
    profileImg: "https://i.pravatar.cc/150?img=21",
    errorImg: "/assets/div.png",
    bio: "Movement disorder specialist focusing on Parkinson's disease and tremors.",
    languages: ["English", "Korean"],
    vibeTags: ["Specialized", "Expert", "Compassionate"],
    rating: 4.9,
    reviewCount: 178,
    experience: 15,
    consultationFee: 115,
    city: "Minneapolis",
    chamberLocation: {
      address: "Neurology Center, Minneapolis",
      city: "Minneapolis",
      zipCode: "55401",
      googleMapsUrl: "https://maps.google.com/?q=neurology+minneapolis",
    },
    telehealth: true,
    inPerson: true,
  },
  {
    _id: "doc_026",
    name: "Dr. Sophia Patel",
    specialization: "Neurologist",
    profileImg: "https://i.pravatar.cc/150?img=22",
    errorImg: "/assets/div (2).png",
    bio: "Headache and migraine specialist with advanced pain management techniques.",
    languages: ["English", "Hindi"],
    vibeTags: ["Empathetic", "Skilled", "Modern"],
    rating: 4.8,
    reviewCount: 156,
    experience: 12,
    consultationFee: 110,
    city: "Charlotte",
    chamberLocation: {
      address: "Headache Clinic, Charlotte",
      city: "Charlotte",
      zipCode: "28201",
      googleMapsUrl: "https://maps.google.com/?q=headache+clinic+charlotte",
    },
    telehealth: true,
    inPerson: true,
  },
];

export default function SearchDoctors() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load all doctors on component mount
    const allDoctors = [...getDoctorsFromAssets(), ...EXTENDED_DOCTORS];
    setDoctors(allDoctors);
    setLoading(false);
  }, []);

  // Group doctors by specialization
  const groupedDoctors = doctors.reduce((acc: any, doctor: any) => {
    const spec = doctor.specialization;
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
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialization
            .toLowerCase()
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
    };
    return icons[specialization] || "⚕️";
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

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-[#ebe2cd] via-white to-[#ebe2cd]/50">
        {/* Header Section */}
        <div className="bg-linear-to-r from-[#2952a1] to-[#1e3d7a] text-white py-12 px-4">
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
          <div className="flex items-center gap-4 mb-8 text-sm text-gray-600">
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
                  <span className="text-3xl">
                    {getSpecializationIcon(specialization)}
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {specialization}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {specialization === "Cardiologist" &&
                        "Heart and cardiovascular specialists"}
                      {specialization === "Orthopedic Surgeon" &&
                        "Bone and joint specialists"}
                      {specialization === "Family Medicine" &&
                        "General healthcare providers"}
                      {specialization === "Neurologist" &&
                        "Brain and nervous system specialists"}
                    </p>
                  </div>
                </div>

                {/* Doctor Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredGroupedDoctors[specialization].map((doctor: any) => (
                    <div
                      key={doctor._id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 p-6"
                    >
                      {/* Doctor Image and Name - Left Aligned */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden shadow-md border-2 border-white flex-shrink-0">
                          {doctor.profileImg ? (
                            <img
                              src={doctor.profileImg}
                              alt={doctor.name}
                              className="w-20 h-20 object-cover rounded-full"
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
                              className="w-20 h-20 object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-2xl font-bold text-blue-600">
                              {doctor.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </span>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {doctor.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {doctor.specialization}
                          </p>

                          {/* Rating */}
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-sm ${
                                  star <= Math.round(doctor.rating)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                            <span className="text-xs text-gray-500 ml-1">
                              ({doctor.reviewCount})
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
                        {doctor.experience && (
                          <span className="flex items-center gap-1">
                            💼 {doctor.experience} years
                          </span>
                        )}
                      </div>

                      {/* Vibe Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {doctor.vibeTags?.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Book Button */}
                      <button
                        onClick={() => router.push(`/doctors/doc_001`)}
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
