// Mock data service - All data handled locally with images from assets
import img1 from "@/assets/img (1).png";
import img2 from "@/assets/img (2).png";
import img3 from "@/assets/img (3).png";
import img4 from "@/assets/img (4).png";
import div1 from "@/assets/div.png";
import div2 from "@/assets/div (2).png";
import div3 from "@/assets/div (3).png";
import div4 from "@/assets/div (4).png";

export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  profileImg?: string;
  errorImg?: string;
  introVideo?: string;
  bio?: string;
  languages: string[];
  vibeTags: string[];
  rating?: number;
  reviewCount?: number;
  experience?: number;
  consultationFee?: number;
  city?: string;
  chamberLocation?: {
    address: string;
    city: string;
    zipCode: string;
    googleMapsUrl?: string;
  };
  telehealth?: boolean;
  inPerson?: boolean;
}

// Mock doctors data with images from assets
const mockDoctors: Doctor[] = [
  {
    _id: "doc_001",
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    profileImg: img1.src,
    errorImg: div1.src,
    introVideo: "/assets/1777892-hd_1280_720_25fps.mp4",
    bio: "Experienced cardiologist with 12+ years of practice. Specializes in preventive cardiology and patient education. Compassionate and thorough in patient care.",
    languages: ["English", "Spanish"],
    vibeTags: ["Compassionate", "Friendly", "Thorough"],
    rating: 4.9,
    reviewCount: 127,
    experience: 12,
    consultationFee: 100,
    city: "Dhaka",
    chamberLocation: {
      address: "123 Heart Care Center, Gulshan Ave",
      city: "Dhaka",
      zipCode: "1212",
      googleMapsUrl: "https://maps.google.com/?q=heart+care+dhaka",
    },
    telehealth: true,
    inPerson: true,
  },
  {
    _id: "doc_002",
    name: "Dr. Michael Chen",
    specialization: "Orthopedic Surgeon",
    profileImg: img2.src,
    errorImg: div2.src,
    introVideo: "/assets/1779202-hd_1280_720_25fps.mp4",
    bio: "Specialized in orthopedic surgery with focus on joint replacement and sports medicine. Known for innovative surgical techniques and excellent patient outcomes.",
    languages: ["English", "Mandarin", "Bengali"],
    vibeTags: ["Innovative", "Patient", "Skilled"],
    rating: 4.8,
    reviewCount: 89,
    experience: 15,
    consultationFee: 120,
    city: "Dhaka",
    chamberLocation: {
      address: "456 Bone Health Clinic, Banani",
      city: "Dhaka",
      zipCode: "1213",
      googleMapsUrl: "https://maps.google.com/?q=orthopedic+dhaka",
    },
    telehealth: false,
    inPerson: true,
  },
  {
    _id: "doc_003",
    name: "Dr. Emily Thompson",
    specialization: "Family Medicine",
    profileImg: img3.src,
    errorImg: div3.src,
    introVideo: "/assets/2063228-uhd_3840_2160_24fps.mp4",
    bio: "Dedicated family medicine physician with 8 years of experience. Provides comprehensive healthcare for all age groups. Believes in preventive care and holistic wellness.",
    languages: ["English", "French"],
    vibeTags: ["Caring", "Holistic", "Approachable"],
    rating: 4.7,
    reviewCount: 156,
    experience: 8,
    consultationFee: 80,
    city: "Dhaka",
    chamberLocation: {
      address: "789 Family Care Clinic, Mirpur",
      city: "Dhaka",
      zipCode: "1216",
      googleMapsUrl: "https://maps.google.com/?q=family+medicine+dhaka",
    },
    telehealth: true,
    inPerson: true,
  },
  {
    _id: "doc_004",
    name: "Dr. David Kumar",
    specialization: "Neurologist",
    profileImg: img4.src,
    errorImg: div4.src,
    introVideo: "/assets/3018542-hd_1920_1080_24fps.mp4",
    bio: "Expert neurologist specializing in migraine management, epilepsy, and neurological disorders. Uses latest diagnostic technology and evidence-based treatments.",
    languages: ["English", "Hindi", "Bengali"],
    vibeTags: ["Expert", "Empathetic", "Modern"],
    rating: 4.9,
    reviewCount: 95,
    experience: 11,
    consultationFee: 110,
    city: "Dhaka",
    chamberLocation: {
      address: "321 Brain Care Center, Dhanmondi",
      city: "Dhaka",
      zipCode: "1205",
      googleMapsUrl: "https://maps.google.com/?q=neurology+dhaka",
    },
    telehealth: true,
    inPerson: true,
  },
];

/**
 * Get all doctors from local mock data
 * This function returns pre-configured doctor data with images from assets
 */
export function getDoctorsFromAssets(): Doctor[] {
  return mockDoctors;
}

/**
 * Get a specific doctor by ID
 */
export function getDoctorById(doctorId: string): Doctor | undefined {
  return mockDoctors.find((doc) => doc._id === doctorId);
}

/**
 * Search doctors by specialization
 */
export function searchDoctorsBySpecialization(
  specialization: string
): Doctor[] {
  return mockDoctors.filter((doc) =>
    doc.specialization.toLowerCase().includes(specialization.toLowerCase())
  );
}

/**
 * Search doctors by name
 */
export function searchDoctorsByName(name: string): Doctor[] {
  return mockDoctors.filter((doc) =>
    doc.name.toLowerCase().includes(name.toLowerCase())
  );
}

/**
 * Filter doctors by rating
 */
export function filterDoctorsByRating(minRating: number): Doctor[] {
  return mockDoctors.filter((doc) => (doc.rating || 0) >= minRating);
}

/**
 * Filter doctors by consultation type
 */
export function filterDoctorsByConsultationType(
  type: "telehealth" | "inPerson"
): Doctor[] {
  if (type === "telehealth") {
    return mockDoctors.filter((doc) => doc.telehealth);
  } else {
    return mockDoctors.filter((doc) => doc.inPerson);
  }
}

/**
 * Filter doctors by language
 */
export function filterDoctorsByLanguage(language: string): Doctor[] {
  return mockDoctors.filter((doc) =>
    doc.languages.some((lang) =>
      lang.toLowerCase().includes(language.toLowerCase())
    )
  );
}

/**
 * Get doctors matching multiple criteria
 */
export function getMatchingDoctors(
  specialization?: string,
  minRating?: number,
  language?: string,
  consultationType?: "telehealth" | "inPerson"
): Doctor[] {
  let results = [...mockDoctors];

  if (specialization) {
    results = results.filter((doc) =>
      doc.specialization.toLowerCase().includes(specialization.toLowerCase())
    );
  }

  if (minRating !== undefined) {
    results = results.filter((doc) => (doc.rating || 0) >= minRating);
  }

  if (language) {
    results = results.filter((doc) =>
      doc.languages.some((lang) =>
        lang.toLowerCase().includes(language.toLowerCase())
      )
    );
  }

  if (consultationType) {
    if (consultationType === "telehealth") {
      results = results.filter((doc) => doc.telehealth);
    } else {
      results = results.filter((doc) => doc.inPerson);
    }
  }

  return results;
}
