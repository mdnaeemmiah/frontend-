// src/api/endpoints.js

export const ENDPOINTS = {
  BASEURL: process.env.NEXT_PUBLIC_API_URL,


  PatientRegister: "/patients/auth/register/",
  patientLogin: "/auth/patient/login/",

  doctorRegister: "/doctors/auth/register/",
  doctorLogin:"/auth/doctor/login/",

  adminLogin: "/auth/admin/login/",

  emailVerification: "/auth/verify-email/verify/",
  resendOTP: "/auth/resend-otp/",
  forgetPassword: "/auth/forgot-password/",
  resetPassword: "/auth/reset-password/",

  doctor_profile:"/doctors/profiles/",
  get_doctor_profile:"/doctors/profiles/",
  doctor_appoinments:"/doctors/appointments/",
  doctor_dashboard:"/doctors/dashboard/stats//admin/dashboard/all_doctors/",

  admin_dashboard:"/admin/dashboard/overview/",
  admin_appointments:"/admin/dashboard/all_doctors/",
  adminApproveStatus:"/admin/dashboard/update_doctor_status/",
  admin_manage_Patents:"/admin/dashboard/all_patients/",
  admin_get_all_apointments:"/admin/dashboard/appointments/",
  admin_update_appointment_status:"/admin/dashboard/update_appointment_status/",


  all_doctors:"/doctors/all/",
  get_single_doctor:"/doctors/",

  book_appointment:"/patients/appointments/create/",
  book_appointment_with_doctor:"/patients/profiles/",

};
