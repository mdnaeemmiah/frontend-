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
  doctor_dashboard:"/doctors/dashboard/stats/",

  admin_dashboard:"/admin/dashboard/overview/",
  admin_appointments:"/admin/dashboard/all_doctors/",

};
