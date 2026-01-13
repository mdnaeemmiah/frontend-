'use client';

import { useState, useEffect } from 'react';

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000'}/api/doctor`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setDoctors(result.data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (doctorId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000'}/api/doctor/change-status/${doctorId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert(`Doctor status updated to ${newStatus}`);
        fetchDoctors();
      }
    } catch (error) {
      console.error('Error updating doctor status:', error);
      alert('Failed to update doctor status');
    }
  };

  const handleApproveProfileUpdate = async (doctorId: string, adminNotes: string = '') => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000'}/api/doctor/${doctorId}/profile-update/approve`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ adminNotes }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert('Profile update approved successfully!');
        setShowUpdateModal(false);
        setSelectedDoctor(null);
        fetchDoctors();
      } else {
        alert(result.message || 'Failed to approve profile update');
      }
    } catch (error) {
      console.error('Error approving profile update:', error);
      alert('Failed to approve profile update');
    }
  };

  const handleRejectProfileUpdate = async (doctorId: string, adminNotes: string) => {
    if (!adminNotes) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000'}/api/doctor/${doctorId}/profile-update/reject`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ adminNotes }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert('Profile update rejected successfully!');
        setShowUpdateModal(false);
        setSelectedDoctor(null);
        fetchDoctors();
      } else {
        alert(result.message || 'Failed to reject profile update');
      }
    } catch (error) {
      console.error('Error rejecting profile update:', error);
      alert('Failed to reject profile update');
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      (filter === 'pending-updates' && doctor.profileUpdateRequest?.status === 'pending') ||
      (filter !== 'pending-updates' && doctor.status === filter);

    return matchesSearch && matchesFilter;
  });

  const pendingUpdatesCount = doctors.filter(
    (d) => d.profileUpdateRequest?.status === 'pending'
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-sm font-semibold text-gray-700">Filter:</span>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending-updates')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending-updates'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending Updates ({pendingUpdatesCount})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'active'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('blocked')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'blocked'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Blocked
          </button>
        </div>

        <input
          type="text"
          placeholder="Search doctors by name, specialization, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Doctors List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            All Doctors ({filteredDoctors.length})
          </h2>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No doctors found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="p-6 hover:bg-gray-50 transition-colors">
                {/* Profile Update Request Banner */}
                {doctor.profileUpdateRequest?.status === 'pending' && (
                  <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-500 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-yellow-900">🔔 Profile Update Request</p>
                        <p className="text-sm text-yellow-800">
                          Requested on{' '}
                          {new Date(doctor.profileUpdateRequest.requestedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setShowUpdateModal(true);
                        }}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700"
                      >
                        Review Changes
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {doctor.profilePicture && (
                      <img
                        src={doctor.profilePicture}
                        alt={doctor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            doctor.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : doctor.status === 'blocked'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {doctor.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p>
                          <span className="font-semibold">Specialization:</span>{' '}
                          {doctor.specialization}
                        </p>
                        <p>
                          <span className="font-semibold">Email:</span> {doctor.email}
                        </p>
                        {doctor.phone && (
                          <p>
                            <span className="font-semibold">Phone:</span> {doctor.phone}
                          </p>
                        )}
                        {doctor.location && (
                          <p>
                            <span className="font-semibold">Location:</span> {doctor.location}
                          </p>
                        )}
                        {doctor.experience && (
                          <p>
                            <span className="font-semibold">Experience:</span> {doctor.experience}{' '}
                            years
                          </p>
                        )}
                      </div>

                      {doctor.bio && (
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                          {doctor.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {doctor.status !== 'active' && (
                      <button
                        onClick={() => handleStatusChange(doctor._id, 'active')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                      >
                        ✅ Activate
                      </button>
                    )}
                    {doctor.status !== 'blocked' && (
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to block this doctor?')) {
                            handleStatusChange(doctor._id, 'blocked');
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
                      >
                        🚫 Block
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Update Review Modal */}
      {showUpdateModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {selectedDoctor.profileImg && (
                  <img
                    src={selectedDoctor.profileImg}
                    alt={selectedDoctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Dr. {selectedDoctor.name}
                  </h2>
                  <p className="text-gray-600">
                    {selectedDoctor.specialization} • {selectedDoctor.experience} years exp
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold">
                  Pending Review
                </span>
                <span className="text-sm text-gray-500">
                  Submitted {new Date(selectedDoctor.profileUpdateRequest.requestedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Video & Tags */}
              <div className="space-y-6">
                {/* Intro Video */}
                {selectedDoctor.profileUpdateRequest.requestedData?.introVideo && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                      <span className="text-blue-600 mr-2">🎥</span> Intro Video
                    </h3>
                    <div className="bg-black rounded-xl overflow-hidden">
                      <video
                        src={selectedDoctor.profileUpdateRequest.requestedData.introVideo}
                        controls
                        className="w-full"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Duration: 1:45 • 1080p</p>
                  </div>
                )}

                {/* Vibe Tags */}
                {selectedDoctor.profileUpdateRequest.requestedData?.vibeTags && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                      <span className="text-blue-600 mr-2">🏷️</span> Vibe Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDoctor.profileUpdateRequest.requestedData.vibeTags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {selectedDoctor.profileUpdateRequest.requestedData?.languages && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDoctor.profileUpdateRequest.requestedData.languages.map((lang: string) => (
                        <span
                          key={lang}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Middle Column - Credentials & Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <span className="text-green-600 mr-2">✓</span> Credentials
                  </h3>
                  <div className="space-y-2">
                    {selectedDoctor.profileUpdateRequest.requestedData?.qualification && (
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-sm text-gray-700">
                          {selectedDoctor.profileUpdateRequest.requestedData.qualification}
                        </span>
                      </div>
                    )}
                    {selectedDoctor.profileUpdateRequest.requestedData?.specialization && (
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-sm text-gray-700">
                          Board Certified {selectedDoctor.profileUpdateRequest.requestedData.specialization}
                        </span>
                      </div>
                    )}
                    {selectedDoctor.profileUpdateRequest.requestedData?.experience && (
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-sm text-gray-700">
                          {selectedDoctor.profileUpdateRequest.requestedData.experience} years experience
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    {selectedDoctor.profileUpdateRequest.requestedData?.email && (
                      <p>
                        <span className="font-semibold">Email:</span>{' '}
                        {selectedDoctor.profileUpdateRequest.requestedData.email}
                      </p>
                    )}
                    {selectedDoctor.profileUpdateRequest.requestedData?.phone && (
                      <p>
                        <span className="font-semibold">Phone:</span>{' '}
                        {selectedDoctor.profileUpdateRequest.requestedData.phone}
                      </p>
                    )}
                    {selectedDoctor.profileUpdateRequest.requestedData?.city && (
                      <p>
                        <span className="font-semibold">Location:</span>{' '}
                        {selectedDoctor.profileUpdateRequest.requestedData.city}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {selectedDoctor.profileUpdateRequest.requestedData?.bio && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Bio</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                      {selectedDoctor.profileUpdateRequest.requestedData.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column - Additional Info */}
              <div className="space-y-6">
                {/* Chamber Location */}
                {selectedDoctor.profileUpdateRequest.requestedData?.chamberLocation && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Chamber Location</h3>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>{selectedDoctor.profileUpdateRequest.requestedData.chamberLocation.address}</p>
                      <p>{selectedDoctor.profileUpdateRequest.requestedData.chamberLocation.city}</p>
                      {selectedDoctor.profileUpdateRequest.requestedData.chamberLocation.googleMapsUrl && (
                        <a
                          href={selectedDoctor.profileUpdateRequest.requestedData.chamberLocation.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View on Google Maps →
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Consultation Fee */}
                {selectedDoctor.profileUpdateRequest.requestedData?.consultationFee && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Consultation Fee</h3>
                    <p className="text-2xl font-bold text-green-600">
                      ${selectedDoctor.profileUpdateRequest.requestedData.consultationFee}
                    </p>
                  </div>
                )}

                {/* Care Options */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Care Options</h3>
                  <div className="space-y-2">
                    {selectedDoctor.profileUpdateRequest.requestedData?.telehealth && (
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">✓</span>
                        <span className="text-sm text-gray-700">Telehealth Available</span>
                      </div>
                    )}
                    {selectedDoctor.profileUpdateRequest.requestedData?.inPerson && (
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">✓</span>
                        <span className="text-sm text-gray-700">In-Person Visits</span>
                      </div>
                    )}
                    {selectedDoctor.profileUpdateRequest.requestedData?.acceptsNewPatients && (
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">✓</span>
                        <span className="text-sm text-gray-700">Accepting New Patients</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Insurance */}
                {selectedDoctor.profileUpdateRequest.requestedData?.insuranceAccepted &&
                  selectedDoctor.profileUpdateRequest.requestedData.insuranceAccepted.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-3">Insurance Accepted</h3>
                      <div className="space-y-1">
                        {selectedDoctor.profileUpdateRequest.requestedData.insuranceAccepted.map(
                          (insurance: string) => (
                            <p key={insurance} className="text-sm text-gray-700">
                              • {insurance}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  const notes = prompt('Add approval notes (optional):');
                  handleApproveProfileUpdate(selectedDoctor._id, notes || '');
                }}
                className="flex-1 bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center space-x-2"
              >
                <span>✓</span>
                <span>Approve</span>
              </button>
              <button
                onClick={() => {
                  const notes = prompt('Reason for rejection (required):');
                  if (notes) {
                    handleRejectProfileUpdate(selectedDoctor._id, notes);
                  }
                }}
                className="flex-1 bg-red-600 text-white py-4 rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center justify-center space-x-2"
              >
                <span>✕</span>
                <span>Reject</span>
              </button>
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedDoctor(null);
                }}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
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
