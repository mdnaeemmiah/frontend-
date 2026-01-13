'use client';

import { useState, useEffect } from 'react';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(appointments.filter((a) => a.status === filter));
    }
  }, [filter, appointments]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000'}/api/appointment`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setAppointments(result.data);
        setFilteredAppointments(result.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentAction = async (
    appointmentId: string,
    status: 'approved' | 'rejected'
  ) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000'}/api/appointment/${appointmentId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
            adminNotes,
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert(`Appointment ${status} successfully!`);
        setShowModal(false);
        setSelectedAppointment(null);
        setAdminNotes('');
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      completed: 'bg-[#ebe2cd] text-[#2952a1]',
      cancelled: 'bg-gray-100 text-gray-700',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#ebe2cd] rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#2952a1] rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-semibold text-gray-700">Filter:</span>
          {['all', 'pending', 'approved', 'rejected', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-[#2952a1] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 text-xs">
                  ({appointments.filter((a) => a.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            All Appointments ({filteredAppointments.length})
          </h2>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No appointments found</p>
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
                      <span className="text-gray-400">→</span>
                      <h3 className="text-lg font-semibold text-[#2952a1]">
                        {appointment.doctorName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>
                        📅{' '}
                        {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
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

                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Reason:</p>
                      <p className="text-sm text-gray-700">{appointment.reason}</p>
                    </div>

                    {appointment.adminNotes && (
                      <div className="bg-[#ebe2cd]/30 rounded-lg p-3 mb-3">
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

                  {appointment.status === 'pending' && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowModal(true);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to reject this appointment?')) {
                            handleAppointmentAction(appointment._id, 'rejected');
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Approve Appointment</h2>

            <div className="bg-[#ebe2cd]/30 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Patient</p>
                  <p className="font-bold text-gray-900">{selectedAppointment.patientName}</p>
                  <p className="text-sm text-gray-600">{selectedAppointment.patientEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Doctor</p>
                  <p className="font-bold text-gray-900">{selectedAppointment.doctorName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700">{selectedAppointment.appointmentTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Type</p>
                  <p className="font-semibold text-gray-900">
                    {selectedAppointment.appointmentType === 'virtual'
                      ? '💻 Virtual'
                      : '🏥 In-Person'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Notes (Optional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                placeholder="Add any notes for the patient or doctor..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleAppointmentAction(selectedAppointment._id, 'approved')}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all"
              >
                ✅ Approve Appointment
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedAppointment(null);
                  setAdminNotes('');
                }}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
