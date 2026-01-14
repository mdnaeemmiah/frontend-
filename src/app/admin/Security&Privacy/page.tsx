"use client";

import { useState } from "react";

export default function AdminSettings() {
  const [encryptionProtocol, setEncryptionProtocol] = useState("AES-256-GCM");
  const [keyRotation, setKeyRotation] = useState("Every 90 days");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Security & Privacy</h1>
        <p className="text-gray-600 mt-1">Manage your platform security and privacy settings</p>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <div className="mb-2">
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-semibold">Secure</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Data Encryption</h3>
          <p className="text-2xl font-bold text-gray-900">AES-256</p>
          <p className="text-xs text-gray-500 mt-1">End-to-end encrypted</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl">👥</span>
          </div>
          <div className="mb-2">
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-semibold">Active</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Access Control</h3>
          <p className="text-2xl font-bold text-gray-900">RBAC</p>
          <p className="text-xs text-gray-500 mt-1">Role-based permissions</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl">🛡️</span>
          </div>
          <div className="mb-2">
            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full font-semibold">GDPR</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Privacy Compliance</h3>
          <p className="text-2xl font-bold text-gray-900">100%</p>
          <p className="text-xs text-gray-500 mt-1">Data protection compliant</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl">🔐</span>
          </div>
          <div className="mb-2">
            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full font-semibold">HTTPS</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-600 mb-1">SSL Certificate</h3>
          <p className="text-2xl font-bold text-gray-900">Valid</p>
          <p className="text-xs text-gray-500 mt-1">Expires in 89 days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Encryption & Security */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Data Encryption & Security</h3>
            </div>
            <button className="px-4 py-2 bg-[#2952a1] text-white rounded-lg font-medium hover:bg-[#1e3d7a] transition-colors text-sm">
              Update Security
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Encryption Protocol
              </label>
              <select
                value={encryptionProtocol}
                onChange={(e) => setEncryptionProtocol(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2952a1] focus:border-transparent"
              >
                <option value="AES-256-GCM">AES-256-GCM</option>
                <option value="AES-192-GCM">AES-192-GCM</option>
                <option value="AES-128-GCM">AES-128-GCM</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Key Rotation
              </label>
              <select
                value={keyRotation}
                onChange={(e) => setKeyRotation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2952a1] focus:border-transparent"
              >
                <option value="Every 30 days">Every 30 days</option>
                <option value="Every 90 days">Every 90 days</option>
                <option value="Every 180 days">Every 180 days</option>
                <option value="Every 365 days">Every 365 days</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">💾</span>
                  <span className="text-xs font-semibold text-gray-600">Database</span>
                </div>
                <p className="text-sm font-bold text-green-600">Encrypted at rest</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">🔄</span>
                  <span className="text-xs font-semibold text-gray-600">Transit</span>
                </div>
                <p className="text-sm font-bold text-green-600">TLS 1.3 encryption</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">☁️</span>
                  <span className="text-xs font-semibold text-gray-600">Backups</span>
                </div>
                <p className="text-sm font-bold text-green-600">Encrypted storage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Management */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Privacy Management</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-red-900 mb-1">Deletion Requests</h4>
                  <p className="text-sm text-red-700">3 pending requests</p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm">
                  Review
                </button>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Data Export</h4>
                  <p className="text-sm text-blue-700">7 requests this month</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                  View
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-3">Retention Policy</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Patient Records</span>
                  <span className="font-bold text-gray-900">7 years</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Chat Logs</span>
                  <span className="font-bold text-gray-900">2 years</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">System Logs</span>
                  <span className="font-bold text-gray-900">1 year</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Based Access Control */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Role-Based Access Control</h3>
          </div>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm">
            Manage Roles
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-xl">👑</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Super Admin</h4>
                <p className="text-sm text-gray-600">Full system access</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-semibold text-gray-700">2 users</span>
              <button className="text-gray-400 hover:text-gray-600">
                <span className="text-xl">⚙️</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl">👨‍⚕️</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Verified Doctor</h4>
                <p className="text-sm text-gray-600">Patient records, prescriptions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-semibold text-gray-700">247 users</span>
              <button className="text-gray-400 hover:text-gray-600">
                <span className="text-xl">⚙️</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl">🧑</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Patient</h4>
                <p className="text-sm text-gray-600">Personal health records only</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-semibold text-gray-700">12,453 users</span>
              <button className="text-gray-400 hover:text-gray-600">
                <span className="text-xl">⚙️</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Logs */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">📋</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Recent Security Events</h3>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { type: "success", icon: "✅", message: "SSL certificate renewed successfully", time: "2 hours ago" },
            { type: "info", icon: "🔑", message: "Encryption keys rotated", time: "1 day ago" },
            { type: "warning", icon: "⚠️", message: "Failed login attempt detected", time: "2 days ago" },
            { type: "success", icon: "🔒", message: "Database backup completed", time: "3 days ago" },
            { type: "info", icon: "👤", message: "New admin user added", time: "5 days ago" },
          ].map((event, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{event.icon}</span>
                <span className="text-sm text-gray-900">{event.message}</span>
              </div>
              <span className="text-xs text-gray-500">{event.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
