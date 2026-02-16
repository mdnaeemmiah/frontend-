// src/api/endpoints.js

export const ENDPOINTS = {
  BASEURL: process.env.NEXT_PUBLIC_API_URL,


  PatientRegister: "/patients/auth/register/",
  patientLogin: "/auth/patient/login/",

  doctorRegister: "/doctors/auth/register/",
  doctorLogin:"/auth/doctor/login/",

  adminLogin: "/auth/login/",

  emailVerification: "/auth/verify-email/verify/",
  forgetPassword: "/auth/forgot-password/",
  resetPassword: "/api/auth/reset-password/",


};
