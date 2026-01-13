'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  profileImg?: string;
  role: string;
  createdAt: string;
}

export default function PatientProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000'}/api/user/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();
      if (result.success) {
        setUser(result.data);
        setFormData({
          name: result.data.name || '',
          phone: result.data.phone || '',
          address: result.data.address || '',
          city: result.data.city || '',
          zipCode: result.data.zipCode || '',
        });
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000'}/api/user/profile`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert('Profile updated successfully!');
        setEditing(false);
        fetchProfile();
      } else {
        alert(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#ebe2cd] rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#2952a1] rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <div className="flex items-center space-x-6">
            {user.profileImg ? (
              <img
                src={user.profileImg}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-[#2952a1]"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2952a1] to-[#1e3d7a] flex items-center justify-center text-white text-3xl font-bold">
                {getInitials(user.name)}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="px-3 py-1 bg-[#ebe2cd] text-[#2952a1] rounded-full text-sm font-medium">
                  {user.role}
                </span>
                <span className="text-sm text-gray-500">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-3 bg-[#2952a1] text-white rounded-xl font-semibold hover:bg-[#1e3d7a] transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2952a1] focus:border-transparent"
                  placeholder="+880 1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2952a1] focus:border-transparent"
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2952a1] focus:border-transparent"
                    placeholder="Dhaka"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2952a1] focus:border-transparent"
                    placeholder="1205"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-[#2952a1] text-white rounded-xl font-semibold hover:bg-[#1e3d7a] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      name: user.name || '',
                      phone: user.phone || '',
                      address: user.address || '',
                      city: user.city || '',
                      zipCode: user.zipCode || '',
                    });
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">Email</p>
                  <p className="text-gray-900">{user.email}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">Phone</p>
                  <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">Address</p>
                  <p className="text-gray-900">{user.address || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">City</p>
                  <p className="text-gray-900">{user.city || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">Zip Code</p>
                  <p className="text-gray-900">{user.zipCode || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-500 mb-1">Role</p>
                  <p className="text-gray-900 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <button
            onClick={() => router.push('/patient/appointments')}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#ebe2cd] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#2952a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">My Appointments</h3>
                <p className="text-sm text-gray-600">View all appointments</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push('/matches')}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#ebe2cd] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#2952a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">My Matches</h3>
                <p className="text-sm text-gray-600">Find your perfect doctor</p>
              </div>
            </div>
          </button>
        </div>
      </div>
      </div>
      
      <Footer />
    </div>
  );
}
