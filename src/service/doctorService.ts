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