import baseApi from "@/api/baseAPi";
import { ENDPOINTS } from "@/api/endPoints";

export interface PatientInfo {
  name: string;
  email: string;
  phone: string;
  profile_picture: string;
}

export interface DoctorInfo {
  name: string;
  specialty: string;
  email: string;
  phone: string;
  profile_picture: string;
}

export interface AppointmentDetails {
  date: string;
  time: string;
  display: string;
  type: string;
}

export interface Appointment {
  id: number;
  booking_id: string;
  patient_info: PatientInfo;
  doctor_info: DoctorInfo;
  appointment_details: AppointmentDetails;
  status: string;
  reason: string;
  message: string;
  contact_method: string;
  booked_date: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  my_appointments: number;
  todays_appointments: number;
  upcoming: number;
  completed: number;
}

export interface TodaysAppointments {
  count: number;
  appointments: Appointment[];
}

export interface DoctorDashboardResponse {
  status: string;
  data: {
    summary: DashboardStats;
    todays_appointments: TodaysAppointments;
    all_appointments: Appointment[];
    total_appointments: number;
    total_patients: number;
  };
}

// Fetch doctor dashboard data
export const getDoctorDashboard = async (): Promise<DoctorDashboardResponse> => {
  try {
    const response = await baseApi.get(ENDPOINTS.doctor_dashboard);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor dashboard:", error);
    throw error;
  }
};

// Get doctor profile
export const getDoctorProfile = async () => {
  try {
    const response = await baseApi.get(ENDPOINTS.get_doctor_profile);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    throw error;
  }
};

// Get doctor appointments
export const getDoctorAppointments = async () => {
  try {
    const response = await baseApi.get(ENDPOINTS.doctor_appoinments);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    throw error;
  }
};

// Get all doctors (public endpoint)
export const getAllDoctors = async () => {
  try {
    const response = await baseApi.get(ENDPOINTS.all_doctors);
    return response.data;
  } catch (error) {
    console.error("Error fetching all doctors:", error);
    throw error;
  }
};

// Get single doctor by ID
export const getSingleDoctor = async (doctorId: string | number) => {
  try {
    const response = await baseApi.get(`${ENDPOINTS.get_single_doctor}${doctorId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching single doctor:", error);
    throw error;
  }
};

// Book appointment with a doctor
export const bookAppointment = async (appointmentData: {
  doctor: number;
  preferred_date: string;
  preferred_time: string;
  reason: string;
  appointment_type: string;
  contact_method: string;
  contact_number: string;
  message: string;
}) => {
  try {
    const response = await baseApi.post(ENDPOINTS.book_appointment, appointmentData);
    return response.data;
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw error;
  }
};

// Interface for patient appointments API response
export interface VibeTag {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface PatientAppointmentDoctor {
  id: number;
  user: number;
  user_name: string;
  user_email: string;
  profile_picture: string;
  specialty: number;
  specialty_name: string;
  credentials: string;
  care_mode: string;
  years_of_experience: number;
  city: string;
  vibe_tags: VibeTag[];
  is_active: boolean;
  is_verified: boolean;
  is_accepting_patients: boolean;
  average_rating: number;
  total_ratings: number;
  intro_video: string | null;
  created_at: string;
}

export interface PatientAppointmentItem {
  id: number;
  patient: number;
  patient_name: string;
  doctor: PatientAppointmentDoctor;
  doctor_name: string;
  preferred_date: string;
  preferred_time: string;
  reason: string;
  appointment_type: string;
  contact_method: string;
  contact_number: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PatientAppointmentsResponse {
  success: boolean;
  patient: {
    id: number;
    user: {
      id: number;
      email: string;
      first_name: string;
      last_name: string;
    };
    date_of_birth: string | null;
    city: string | null;
    country: string | null;
    zip_code: string | null;
    latitude: string | null;
    longitude: string | null;
    phone_number: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  appointments: {
    total: number;
    pending: number;
    approved: number;
    upcoming: number;
    past: number;
    all_appointments: PatientAppointmentItem[];
  };
}

// Get patient appointments by user_id from localStorage
export const getPatientAppointments = async (): Promise<PatientAppointmentsResponse> => {
  try {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      throw new Error("User ID not found in localStorage");
    }
    const response = await baseApi.get(`${ENDPOINTS.book_appointment_with_doctor}${userId}/with-appointments/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    throw error;
  }
};