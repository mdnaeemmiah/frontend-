/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import baseApi from "@/api/baseAPi";
import { ENDPOINTS } from "@/api/endPoints";
import bgImage from "../../assets/bg.png";
import logo from "../../assets/Frame.png";

const verifySchema = z.object({
  email: z.string().email("Valid email is required"),
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

type VerifyFormData = z.infer<typeof verifySchema>;

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [verificationData, setVerificationData] = useState<any>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
  });

  const email = watch("email");

  useEffect(() => {
    // Get email from localStorage if available
    const storedEmail = localStorage.getItem("verificationEmail");
    if (storedEmail) {
      setValue("email", storedEmail);
    } else {
      // If no stored email, redirect back to signup
      setError("No email found for verification. Please register first.");
    }
  }, [setValue]);

  const onSubmit = async (data: VerifyFormData) => {
    setIsLoading(true);
    setError("");

    try {
      // Get email from localStorage if not in form data
      const emailToUse = data.email || localStorage.getItem("verificationEmail");
      
      if (!emailToUse) {
        throw new Error("No email found for verification. Please register first.");
      }

      const response = await baseApi.post(ENDPOINTS.emailVerification, {
        email: emailToUse,
        otp: data.otp,
      });

      const result = response.data;

      // Clear stored email
      localStorage.removeItem("verificationEmail");

      // Store user role from verification response
      if (result.role) {
        localStorage.setItem("userRole", result.role);
      }

      setVerificationData(result);
      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Invalid OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    const emailToUse = email || localStorage.getItem("verificationEmail");
    
    if (!emailToUse) {
      setError("No email found for verification. Please register first.");
      return;
    }

    setResendLoading(true);
    setResendMessage("");
    setError("");

    try {
      const response = await baseApi.post(ENDPOINTS.resendOTP, {
        email: emailToUse,
      });

      setResendMessage("✅ New OTP sent! Check your email.");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to resend OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImage}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Email Verified Successfully! ✅
          </h2>
          {verificationData && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-800 font-semibold">
                {verificationData.message || "Email verified successfully. You can now login."}
              </p>
              {verificationData.role && (
                <p className="text-green-700 text-sm mt-2">
                  Welcome as: <span className="font-semibold capitalize">{verificationData.role}</span>
                </p>
              )}
              {verificationData.email && (
                <p className="text-green-600 text-sm mt-1">
                  Email: {verificationData.email}
                </p>
              )}
            </div>
          )}
          <p className="text-gray-600 mb-4">
            Your account has been activated successfully.
          </p>
          <p className="text-gray-500 text-sm mb-4">Redirecting to login page in 3 seconds...</p>
          <div className="space-y-3">
            <Link
              href="/login"
              className="inline-block bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#1e3d7a] hover:to-[#2952a1] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Go to Login Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-y-auto">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <Image
              src={logo}
              alt="NovaHealth Logo"
              width={40}
              height={40}
              className="group-hover:scale-105 transition-transform duration-200"
            />
            <span className="text-3xl font-bold bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] bg-clip-text text-transparent">
              NovaHealth
            </span>
          </Link>
          <p className="mt-3 text-gray-700 text-lg font-medium ">Verify your email</p>
        </div>

        {/* Verification Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#2952a1]/10 to-[#1e3d7a]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📧</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h1>
            <p className="text-gray-600">
              We've sent a 6-digit OTP (One-Time Password) to:
            </p>
            {email && (
              <p className="text-[#2952a1] font-semibold text-lg mt-2">
                {email}
              </p>
            )}
            <p className="text-gray-600 mt-2">
              Please enter the OTP below to verify and activate your account.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
              <span className="text-red-600 mr-2">⚠️</span>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message for Resend */}
          {resendMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <p className="text-green-700 text-sm">{resendMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            {/* <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2952a1] focus:border-transparent transition-all duration-200 text-gray-900"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div> */}

            {/* OTP Field */}
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                OTP (One-Time Password)
              </label>
              <input
                id="otp"
                type="text"
                maxLength={6}
                {...register("otp")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2952a1] focus:border-transparent transition-all duration-200 text-gray-900 text-center text-2xl font-bold tracking-widest"
                placeholder="000000"
                autoComplete="off"
              />
              {errors.otp && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.otp.message}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500 text-center">
                Enter the 6-digit OTP from your email
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] text-white py-4 rounded-xl font-semibold hover:from-[#1e3d7a] hover:to-[#2952a1] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify Email & Activate Account"
              )}
            </button>
          </form>

          {/* Resend OTP */}
          {/* <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Didn't receive the OTP?</p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading}
              className="text-[#2952a1] hover:text-[#1e3d7a] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
            </button>
          </div> */}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-[#2952a1] hover:text-[#1e3d7a] transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
