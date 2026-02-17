/* eslint-disable react-hooks/immutability */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import logo from "../assets/image/div.png";
import logo1 from "../assets/image/attachment-removebg-preview 1.svg";

interface User {
  name: string;
  email: string;
  role: string;
  profileImg?: string;
}

export default function Navigation() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuthStatus();

    // Close dropdown and mobile menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoggedIn(false);
      setUser(null);
      return;
    }

    // Get user data from localStorage
    const savedUser = localStorage.getItem("user");
    const userRole = localStorage.getItem("userRole");
    
    setIsLoggedIn(true);
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser({
        name: `${userData.first_name || ""} ${userData.last_name || ""}`.trim() || "User",
        email: userData.email || "",
        role: userRole || "patient",
        profileImg: userData.profileImg || undefined,
      });
    } else {
      setUser({
        name: "User",
        email: localStorage.getItem("userEmail") || "",
        role: userRole || "patient",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
    setShowMobileMenu(false);
    router.replace("/login");
  };

  const handleMobileMenuItemClick = () => {
    setShowMobileMenu(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <Image
                src={logo}
                alt="NovaHealth Logo"
                width={40}
                height={40}
                className="group-hover:scale-105 transition-transform duration-200"
              />
              <Image
                src={logo1}
                alt="Logo"
                width={100}
                height={100}
                className="object-contain h-[30px] sm:h-[40px] w-auto"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/onboarding"
              className="relative text-gray-600 hover:text-[#2952a1] px-4 py-2 rounded-lg text-md font-semibold transition-all duration-200 group"
            >
              <span className="relative z-10">Find Doctors</span>
              <div className="absolute inset-0 bg-[#ebe2cd]/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
            <Link
              href="/matches"
              className="relative text-gray-600 hover:text-[#2952a1] px-4 py-2 rounded-lg text-md font-semibold transition-all duration-200 group"
            >
              <span className="relative z-10">My Matches</span>
              <div className="absolute inset-0 bg-[#ebe2cd]/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
            <Link
              href="/search-doctors"
              className="relative text-gray-600 hover:text-[#2952a1] px-4 py-2 rounded-lg text-md font-semibold transition-all duration-200 group"
            >
              <span className="relative z-10">All Doctors</span>
              <div className="absolute inset-0 bg-[#ebe2cd]/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>

            {/* Auth Section */}
            {isLoggedIn && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {user.profileImg ? (
                    <img
                      src={user.profileImg}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#2952a1]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2952a1] to-[#1e3d7a] flex items-center justify-center text-white font-semibold">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>

                    <Link
                      href="/patient/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 text-gray-500 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          My Profile
                        </p>
                        <p className="text-xs text-gray-500">
                          View and update profile
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/patient/appointments"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 text-gray-500 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          My Appointments
                        </p>
                        <p className="text-xs text-gray-500">
                          View all appointments
                        </p>
                      </div>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 hover:bg-red-50 transition-colors border-t border-gray-100 mt-2"
                    >
                      <svg
                        className="w-5 h-5 text-red-500 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <div className="text-left">
                        <p className="text-sm font-medium text-red-600">
                          Logout
                        </p>
                        <p className="text-xs text-red-400">
                          Sign out of your account
                        </p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="relative text-gray-600 hover:text-[#2952a1] px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 group"
                >
                  <span className="relative z-10 text-[16px]">Sign In</span>
                  <div className="absolute inset-0 bg-[#ebe2cd]/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </Link>
                <Link
                  href="/signup"
                  className="relative bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 group overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#1e3d7a] to-[#2952a1] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="relative z-10 flex items-center text-[16px]">
                    Sign Up
                    <svg
                      className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-600 hover:text-[#2952a1] p-2 rounded-lg transition-colors"
            >
              <svg
                className={`w-6 h-6 transition-transform ${showMobileMenu ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {showMobileMenu ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Popup */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)}>
          <div 
            ref={mobileMenuRef}
            className="absolute top-20 right-0 left-0 mx-4 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Navigation Links */}
              <div className="space-y-2 mb-6">
                <Link
                  href="/onboarding"
                  onClick={handleMobileMenuItemClick}
                  className="flex items-center space-x-3 p-4 rounded-xl hover:bg-[#ebe2cd]/30 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2952a1] to-[#1e3d7a] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Find Doctors</p>
                    <p className="text-sm text-gray-500">Discover healthcare providers</p>
                  </div>
                </Link>

                <Link
                  href="/matches"
                  onClick={handleMobileMenuItemClick}
                  className="flex items-center space-x-3 p-4 rounded-xl hover:bg-[#ebe2cd]/30 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">My Matches</p>
                    <p className="text-sm text-gray-500">View matched doctors</p>
                  </div>
                </Link>

                <Link
                  href="/search-doctors"
                  onClick={handleMobileMenuItemClick}
                  className="flex items-center space-x-3 p-4 rounded-xl hover:bg-[#ebe2cd]/30 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">All Doctors</p>
                    <p className="text-sm text-gray-500">Browse all providers</p>
                  </div>
                </Link>
              </div>

              {/* Auth Section */}
              {isLoggedIn && user ? (
                <>
                  {/* User Profile Section */}
                  <div className="border-t border-gray-100 pt-6 mb-6">
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-[#ebe2cd]/20 to-[#ebe2cd]/10 rounded-xl mb-4">
                      {user.profileImg ? (
                        <img
                          src={user.profileImg}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#2952a1]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2952a1] to-[#1e3d7a] flex items-center justify-center text-white font-semibold">
                          {getInitials(user.name)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-[#2952a1] font-medium capitalize">{user.role}</p>
                      </div>
                    </div>

                    {/* User Menu Items */}
                    <div className="space-y-2">
                      <Link
                        href="/patient/profile"
                        onClick={handleMobileMenuItemClick}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">My Profile</p>
                          <p className="text-xs text-gray-500">View and update profile</p>
                        </div>
                      </Link>

                      <Link
                        href="/patient/appointments"
                        onClick={handleMobileMenuItemClick}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">My Appointments</p>
                          <p className="text-xs text-gray-500">View all appointments</p>
                        </div>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-left"
                      >
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <div>
                          <p className="font-medium text-red-600">Logout</p>
                          <p className="text-xs text-red-400">Sign out of your account</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Login/Signup Section */}
                  <div className="border-t border-gray-100 pt-6 space-y-3">
                    <Link
                      href="/login"
                      onClick={handleMobileMenuItemClick}
                      className="flex items-center justify-center space-x-2 w-full p-4 border-2 border-[#2952a1] text-[#2952a1] rounded-xl font-semibold hover:bg-[#ebe2cd]/30 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Login</span>
                    </Link>
                    
                    <Link
                      href="/signup"
                      onClick={handleMobileMenuItemClick}
                      className="flex items-center justify-center space-x-2 w-full p-4 bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      <span>Sign Up</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
