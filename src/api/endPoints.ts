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


};
