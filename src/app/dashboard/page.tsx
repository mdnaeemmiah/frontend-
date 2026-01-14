"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  profileImg?: string;
  profileImage?: string;
}

// Static user data
const STATIC_USER: User = {
  _id: "user_001",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "patient",
  profileImg: "https://i.pravatar.cc/150?img=12",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user] = useState<User>(STATIC_USER);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col items-center">
                {user.profileImage || user.profileImg ? (
                  <img
                    src={user.profileImage || user.profileImg}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-blue-600">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                )}
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  {user.name}
                </h2>
                <p className="text-gray-600 text-center mb-2">{user.email}</p>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* User Info Card */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Account Information
              </h3>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-lg font-medium text-gray-900">
                    {user.email}
                  </p>
                </div>
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="text-lg font-medium text-gray-900">
                    {user._id}
                  </p>
                </div>
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="text-lg font-medium text-gray-900 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/patient/profile"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">Profile</h3>
            <p className="text-gray-600">View and edit your profile</p>
          </Link>
          <Link
            href="/patient/appointments"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Appointments
            </h3>
            <p className="text-gray-600">View your appointments</p>
          </Link>
          <Link
            href="/matches"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Find Doctors
            </h3>
            <p className="text-gray-600">Find your perfect doctor match</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
