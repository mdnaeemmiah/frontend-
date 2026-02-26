import baseApi from "@/api/baseAPi";
import { ENDPOINTS } from "@/api/endPoints";

export interface PatientInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  profile_picture: string;
}

export interface DoctorInfo {
  id: number;
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

export interface AdminAppointment {
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

export interface UsersStats {
  total: number;
  total_doctors: number;
  total_patients: number;
  new_this_week: number;
  new_this_month: number;
}

export interface DoctorsStats {
  total: number;
  verified: number;
  pending: number;
  rejected: number;
  new_this_week: number;
}

export interface PatientsStats {
  total: number;
  new_this_week: number;
}

export interface MatchesStats {
  total: number;
  this_week: number;
  this_month: number;
}

export interface DailyAppointment {
  day: string;
  date: string;
  count: number;
  percentage: number;
}

export interface AppointmentsStats {
  total: number;
  pending: number;
  scheduled: number;
  completed: number;
  daily_this_week: DailyAppointment[];
  all_appointments: AdminAppointment[];
}

export interface AdminDashboardResponse {
  users: UsersStats;
  doctors: DoctorsStats;
  patients: PatientsStats;
  matches: MatchesStats;
  appointments: AppointmentsStats;
}

export interface VibeTag {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: number;
  user: number;
  user_name: string;
  user_email: string;
  profile_picture: string;
  specialty: number | null;
  specialty_name?: string;
  credentials: string;
  care_mode: string;
  years_of_experience: number;
  city: string | null;
  vibe_tags: VibeTag[];
  is_active: boolean;
  is_verified: boolean;
  is_accepting_patients: boolean;
  average_rating: number;
  total_ratings: number;
  intro_video: string | null;
  created_at: string;
  verification_status: string;
}

export interface AdminAppointmentsStats {
  pending: number;
  approved: number;
  rejected: number;
  completed: number;
  total: number;
}

export interface AdminAppointmentsResponse {
  count: number;
  appointments: AdminAppointmentsStats;
  doctors: Doctor[];
}

export interface PatientUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Patient {
  id: number;
  user: PatientUser;
  date_of_birth: string | null;
  city: string | null;
  country: string | null;
  zip_code: string | null;
  latitude: number | null;
  longitude: number | null;
  phone_number: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  has_preferences: boolean;
  verification_status: string;
}

export interface AdminPatientsResponse {
  count: number;
  patients: Patient[];
}

export interface AppointmentPatientInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  profile_picture: string;
}

export interface AppointmentDoctorInfo {
  id: number;
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

export interface AdminAppointment {
  id: number;
  booking_id: string;
  patient_info: AppointmentPatientInfo;
  doctor_info: AppointmentDoctorInfo;
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

export interface StatusStatistics {
  pending: number;
  contacted: number;
  scheduled: number;
  cancelled: number;
  completed: number;
  total: number;
}

export interface AdminAllAppointmentsResponse {
  count: number;
  page: number;
  size: number;
  total_pages: number;
  status_statistics: StatusStatistics;
  appointments: AdminAppointment[];
}

// Fetch admin appointments data
export const getAdminAppointments = async (): Promise<AdminAppointmentsResponse> => {
  try {
    const response = await baseApi.get(ENDPOINTS.admin_appointments);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin appointments:", error);
    throw error;
  }
};

// Update doctor approval status
export const adminApproveStatus = async (doctorId: number, action: string, reason: string): Promise<any> => {
  try {
    const response = await baseApi.post(ENDPOINTS.adminApproveStatus, {
      doctor_id: doctorId,
      action: action,
      reason: reason
    });
    return response.data;
  } catch (error) {
    console.error("Error updating doctor status:", error);
    throw error;
  }
};

// Fetch admin dashboard data
export const getAdminDashboard = async (): Promise<AdminDashboardResponse> => {
  try {
    const response = await baseApi.get(ENDPOINTS.admin_dashboard);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    throw error;
  }
};

// Fetch admin patients data
export const getAdminPatients = async (): Promise<AdminPatientsResponse> => {
  try {
    const response = await baseApi.get(ENDPOINTS.admin_manage_Patents);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin patients:", error);
    throw error;
  }
};

// Fetch all admin appointments
export const getAdminAllAppointments = async (): Promise<AdminAllAppointmentsResponse> => {
  try {
    const response = await baseApi.get(ENDPOINTS.admin_get_all_apointments);
    return response.data;
  } catch (error) {
    console.error("Error fetching all admin appointments:", error);
    throw error;
  }
};

// Update appointment status
export const updateAppointmentStatus = async (appointmentId: number, status: string, notes?: string): Promise<any> => {
  try {
    const response = await baseApi.post(ENDPOINTS.admin_update_appointment_status, {
      appointment_id: appointmentId,
      status: status,
      reason: notes || ""
    });
    return response.data;
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
};