/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || 'https://practice-backend-oauth-image-video.vercel.app'}/api/appointment/doctor-appointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setAppointments(result.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments =
    filter === 'all'
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const upcomingAppointments = appointments.filter(
    (a) => new Date(a.appointmentDate) >= new Date() && a.status === 'approved'
  );

  const completedAppointments = appointments.filter((a) => a.status === 'completed');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#ebe2cd] rounded-lg flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{appointments.length}</p>
              <p className="text-gray-600">Total Appointments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{upcomingAppointments.length}</p>
              <p className="text-gray-600">Upcoming</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#ebe2cd] rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{completedAppointments.length}</p>
              <p className="text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-semibold text-gray-700">Filter:</span>
          {['all', 'approved', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Appointments ({filteredAppointments.length})
          </h2>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-600 font-medium">No appointments found</p>
            <p className="text-sm text-gray-500 mt-2">
              Approved appointments will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAppointments.map((appointment) => (
              <div key={appointment._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {appointment.patientName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          appointment.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-[#ebe2cd] text-[#2952a1]'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>
                        📅{' '}
                        {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <span>🕐 {appointment.appointmentTime}</span>
                      <span>•</span>
                      <span>
                        {appointment.appointmentType === 'virtual'
                          ? '💻 Virtual'
                          : '🏥 In-Person'}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Reason for Visit:
                      </p>
                      <p className="text-sm text-gray-700">{appointment.reason}</p>
                    </div>

                    {appointment.adminNotes && (
                      <div className="bg-[#ebe2cd]/30 rounded-lg p-4 mb-3">
                        <p className="text-sm font-semibold text-[#2952a1] mb-1">Admin Notes:</p>
                        <p className="text-sm text-[#2952a1]">{appointment.adminNotes}</p>
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>📧 {appointment.patientEmail}</span>
                      {appointment.patientPhone && (
                        <>
                          <span>•</span>
                          <span>📱 {appointment.patientPhone}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
