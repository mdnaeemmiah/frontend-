/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Static admin data
const STATIC_ADMIN = {
  name: "Admin User",
  email: "admin@novahealth.com",
  role: "admin",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin] = useState<any>(STATIC_ADMIN);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    // Clear any stored tokens
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    // Redirect to home page
    router.push("/");
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: "📊",
      path: "/admin/dashboard",
    },
    {
      name: "Appointments",
      icon: "📅",
      path: "/admin/appointments",
      badge: "pending",
    },
    {
      name: "Availability Requests",
      icon: "🕐",
      path: "/admin/availability",
    },
    {
      name: "Manage Doctors",
      icon: "👨‍⚕️",
      path: "/admin/doctors",
    },
    {
      name: "Manage Patients",
      icon: "👥",
      path: "/admin/patients",
    },
    {
      name: "Analytics",
      icon: "📈",
      path: "/admin/analytics",
    },
    {
      name: "Security & Privacy",
      icon: "⚙️",
      path: "/admin/Security&Privacy",
    },
    {
      name: "Setting",
      icon: "⚙️",
      path: "/admin/settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-xl transition-all duration-300 z-40 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200">
          {sidebarOpen ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2952a1] to-[#1e3d7a] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">
                  NovaHealth
                </span>
                <p className="text-xs text-gray-500">Admin Portal</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-[#2952a1] to-[#1e3d7a] rounded-xl flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-lg">N</span>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-24 bg-white border-2 border-gray-200 rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-50"
        >
          <span className="text-xs">{sidebarOpen ? "←" : "→"}</span>
        </button>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-[#2952a1] text-white shadow-lg"
                    : "text-gray-700 hover:bg-[#ebe2cd]/30"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && (
                  <>
                    <span className="font-medium flex-1">{item.name}</span>
                    {item.badge && (
                      <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs rounded-full font-bold">
                        !
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Admin Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          {sidebarOpen ? (
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2952a1] to-[#1e3d7a] rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {admin?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {admin?.name}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-[#2952a1] to-[#1e3d7a] rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold">
                {admin?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`w-full bg-red-100 text-red-600 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors ${
              !sidebarOpen && "text-xs"
            }`}
          >
            {sidebarOpen ? "Logout" : "🚪"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-20 flex items-center px-8">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {menuItems.find((item) => item.path === pathname)?.name ||
                "Admin Panel"}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
