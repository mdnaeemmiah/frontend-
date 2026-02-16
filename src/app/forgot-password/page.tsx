/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import bgImage from "../../assets/bg.png";
import logo from "../../assets/Frame.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import imn1 from "../../assets/image/attachment-removebg-preview 1.svg";


const forgotPasswordSchema = z.object({
  email: z.string().email("Valid email is required"),
});

const verifyCodeSchema = z.object({
  code: z.string().min(6, "Code must be 6 digits").max(6),
});

const setPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;
type SetPasswordFormData = z.infer<typeof setPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "verify" | "set-password" | "success">("request");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (step === "success") {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 1000); // Redirect after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [step, router]);

  const forgotForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const verifyForm = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
  });

  const setPasswordForm = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
  });

  const onRequestCode = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError("");

    try {
      // Static forgot password - simulate sending code
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

      setEmail(data.email);
      setStep("verify");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyCode = async (data: VerifyCodeFormData) => {
    setIsLoading(true);
    setError("");

    try {
      // Static verify code - simulate successful verification
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

      setStep("set-password");
    } catch (err: any) {
      setError(err.message || "Invalid or expired code fix verification.");
    } finally {
      setIsLoading(false);
    }
  };

  const onResetPassword = async (data: SetPasswordFormData) => {
    setIsLoading(true);
    setError("");

    try {
      // Static reset password - simulate successful reset
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay

      setStep("success");
    } catch (err: any) {
      setError(err.message || "Password reset failed.");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "success") {
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
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
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
            Password Reset! 🎉
          </h2>
          <p className="text-gray-600 mb-8">
            Your password has been successfully reset. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
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
              width={48}
              height={48}
              className="group-hover:scale-105 transition-transform duration-200"
            />
            <span className="text-3xl font-bold bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] bg-clip-text text-transparent">
                           <Image
                src={imn1}
                alt="NovaHealth Logo"
                width={250}
                height={100}
                className=""
              ></Image>
            </span>
          </Link>
          <p className="mt-3 text-gray-700 text-lg font-medium">
            Reset your password
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100">
          {step === "request" && (
            <>
              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-[#ebe2cd]/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🔐</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Forgot Password?
                </h1>
                <p className="text-gray-600">
                  No worries! Enter your email and we'll send you a reset code.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                  <span className="text-red-600 mr-2">⚠️</span>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form
                onSubmit={forgotForm.handleSubmit(onRequestCode)}
                className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...forgotForm.register("email")}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                    placeholder="you@example.com"
                  />
                  {forgotForm.formState.errors.email && (
                    <p className="mt-2 text-sm text-red-600">
                      {forgotForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] text-white py-4 rounded-xl font-semibold hover:from-[#1e3d7a] hover:to-[#2952a1] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? "Sending..." : "Send Reset Code"}
                </button>
              </form>
            </>
          )}

          {step === "verify" && (
            <>
              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-[#ebe2cd]/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📧</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Verify Code
                </h1>
                <p className="text-gray-600">
                  Enter the 6-digit code sent to <span className="font-semibold text-gray-900">{email}</span>
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                  <span className="text-red-600 mr-2">⚠️</span>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form
                onSubmit={verifyForm.handleSubmit(onVerifyCode)}
                className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="code"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Verification Code
                  </label>
                  <input
                    id="code"
                    type="text"
                    maxLength={6}
                    {...verifyForm.register("code")}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 text-center text-2xl font-bold tracking-widest"
                    placeholder="000000"
                  />
                  {verifyForm.formState.errors.code && (
                    <p className="mt-2 text-sm text-red-600">
                      {verifyForm.formState.errors.code.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] text-white py-4 rounded-xl font-semibold hover:from-[#1e3d7a] hover:to-[#2952a1] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </button>
                
                <p className="text-center text-sm text-gray-500">
                  Didn't receive the code?{" "}
                  <button 
                    type="button"
                    onClick={() => setStep("request")}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Resend
                  </button>
                </p>
              </form>
            </>
          )}

          {step === "set-password" && (
            <>
              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-[#ebe2cd]/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🔐</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  New Password
                </h1>
                <p className="text-gray-600">
                  Set a secure password for your account
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                  <span className="text-red-600 mr-2">⚠️</span>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form
                onSubmit={setPasswordForm.handleSubmit(onResetPassword)}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      {...setPasswordForm.register("newPassword")}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                  </div>
                  {setPasswordForm.formState.errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {setPasswordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...setPasswordForm.register("confirmPassword")}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                  </div>
                  {setPasswordForm.formState.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {setPasswordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] text-white py-4 rounded-xl font-semibold hover:from-[#1e3d7a] hover:to-[#2952a1] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? "Saving..." : "Set Password"}
                </button>
              </form>
            </>
          )}

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
