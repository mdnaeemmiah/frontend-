"use client";

import { useState } from "react";

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("7days");

  // Static analytics data
  const stats = {
    totalRevenue: 45680,
    totalAppointments: 342,
    activeUsers: 1248,
    avgRating: 4.8,
  };

  const appointmentsByDay = [
    { day: "Mon", count: 45 },
    { day: "Tue", count: 52 },
    { day: "Wed", count: 48 },
    { day: "Thu", count: 61 },
    { day: "Fri", count: 55 },
    { day: "Sat", count: 38 },
    { day: "Sun", count: 43 },
  ];

  const topDoctors = [
    { name: "Dr. Sarah Johnson", appointments: 89, rating: 4.9, revenue: 8900 },
    { name: "Dr. Michael Chen", appointments: 76, rating: 4.8, revenue: 9120 },
    { name: "Dr. Emily Thompson", appointments: 68, rating: 4.7, revenue: 5440 },
    { name: "Dr. David Kumar", appointments: 54, rating: 4.9, revenue: 5940 },
    { name: "Dr. Amanda Rodriguez", appointments: 55, rating: 4.6, revenue: 4950 },
  ];

  const specializations = [
    { name: "Cardiology", count: 89, percentage: 26 },
    { name: "Orthopedics", count: 76, percentage: 22 },
    { name: "Family Medicine", count: 68, percentage: 20 },
    { name: "Neurology", count: 54, percentage: 16 },
    { name: "Dermatology", count: 55, percentage: 16 },
  ];

  const recentActivity = [
    { type: "appointment", user: "John Doe", action: "booked appointment with Dr. Sarah Johnson", time: "5 min ago" },
    { type: "signup", user: "Jane Smith", action: "created new account", time: "12 min ago" },
    { type: "review", user: "Robert Brown", action: "left 5-star review for Dr. Michael Chen", time: "23 min ago" },
    { type: "appointment", user: "Lisa Anderson", action: "cancelled appointment", time: "1 hour ago" },
    { type: "payment", user: "Michael Wilson", action: "completed payment of $120", time: "2 hours ago" },
  ];

  const maxAppointments = Math.max(...appointmentsByDay.map((d) => d.count));

  return (
    <div className="space-y-6">
      {/* Header with Time Range Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your platform performance</p>
        </div>
        <div className="flex items-center space-x-2">
          {["7days", "30days", "90days", "1year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range
                  ? "bg-[#2952a1] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {range === "7days"
                ? "7 Days"
                : range === "30days"
                ? "30 Days"
                : range === "90days"
                ? "90 Days"
                : "1 Year"}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">+12%</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">${stats.totalRevenue.toLocaleString()}</h3>
          <p className="text-gray-600">Total Revenue</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">+8%</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalAppointments}</h3>
          <p className="text-gray-600">Total Appointments</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">+15%</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.activeUsers.toLocaleString()}</h3>
          <p className="text-gray-600">Active Users</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
            <span className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">+0.2</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.avgRating}</h3>
          <p className="text-gray-600">Average Rating</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Appointments This Week</h3>
          <div className="space-y-4">
            {appointmentsByDay.map((day) => (
              <div key={day.day}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">{day.day}</span>
                  <span className="text-sm font-bold text-[#2952a1]">{day.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] h-3 rounded-full transition-all"
                    style={{ width: `${(day.count / maxAppointments) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Doctors */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Top Performing Doctors</h3>
          <div className="space-y-4">
            {topDoctors.map((doctor, index) => (
              <div
                key={doctor.name}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#2952a1] to-[#1e3d7a] rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{doctor.name}</h4>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <span>📅 {doctor.appointments} appointments</span>
                    <span>⭐ {doctor.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">${doctor.revenue}</p>
                  <p className="text-xs text-gray-500">revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Specializations Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Appointments by Specialization</h3>
          <div className="space-y-4">
            {specializations.map((spec) => (
              <div key={spec.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">{spec.name}</span>
                  <span className="text-sm font-bold text-[#2952a1]">
                    {spec.count} ({spec.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-[#2952a1] to-[#1e3d7a] h-3 rounded-full transition-all"
                    style={{ width: `${spec.percentage * 3.8}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === "appointment"
                      ? "bg-blue-100"
                      : activity.type === "signup"
                      ? "bg-green-100"
                      : activity.type === "review"
                      ? "bg-yellow-100"
                      : activity.type === "payment"
                      ? "bg-purple-100"
                      : "bg-gray-100"
                  }`}
                >
                  <span className="text-lg">
                    {activity.type === "appointment"
                      ? "📅"
                      : activity.type === "signup"
                      ? "👤"
                      : activity.type === "review"
                      ? "⭐"
                      : activity.type === "payment"
                      ? "💳"
                      : "📋"}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
