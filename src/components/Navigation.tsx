/* eslint-disable react-hooks/immutability */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import logo from "../assets/Frame.png";

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuthStatus();

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsLoggedIn(false);
      setUser(null);
      return;
    }

    // Static user data - no API call
    setIsLoggedIn(true);
    setUser({
      name: "John Doe",
      email: "john.doe@example.com",
      role: "patient",
      profileImg: "https://i.pravatar.cc/150?img=33",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
    router.push("/");
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
              <span className="text-2xl font-bold bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] bg-clip-text text-transparent">
                NovaHealth
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/onboarding"
              className="relative text-gray-600 hover:text-[#2952a1] px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 group"
            >
              <span className="relative z-10">Find Doctors</span>
              <div className="absolute inset-0 bg-[#ebe2cd]/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
            <Link
              href="/matches"
              className="relative text-gray-600 hover:text-[#2952a1] px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 group"
            >
              <span className="relative z-10">My Matches</span>
              <div className="absolute inset-0 bg-[#ebe2cd]/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
            <Link
              href="/search-doctors"
              className="relative text-gray-600 hover:text-[#2952a1] px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 group"
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
                  <span className="relative z-10">Login</span>
                  <div className="absolute inset-0 bg-[#ebe2cd]/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </Link>
                <Link
                  href="/signup"
                  className="relative bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 group overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#1e3d7a] to-[#2952a1] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="relative z-10 flex items-center">
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
            <button className="text-gray-600 hover:text-[#2952a1] p-2 rounded-lg transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
