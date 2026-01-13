'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  _id: string;
  patientName: string;
  patientEmail: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function DoctorMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000'}/api/message/my-messages`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setMessages(result.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5000'}/api/message/${messageId}/read`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        setMessages(messages.map(msg => 
          msg._id === messageId ? { ...msg, isRead: true } : msg
        ));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      markAsRead(message._id);
    }
  };

  const filteredMessages = messages
    .filter(msg => {
      if (filter === 'unread') return !msg.isRead;
      if (filter === 'read') return msg.isRead;
      return true;
    })
    .filter(msg => 
      msg.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const unreadCount = messages.filter(msg => !msg.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 font-medium">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/doctor/dashboard')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              {unreadCount > 0 && (
                <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold">
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Search and Filter */}
              <div className="p-4 border-b border-gray-100">
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      filter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All ({messages.length})
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      filter === 'unread'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                  <button
                    onClick={() => setFilter('read')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      filter === 'read'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Read ({messages.length - unreadCount})
                  </button>
                </div>
              </div>

              {/* Messages List */}
              <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                {filteredMessages.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-gray-600 font-medium">No messages found</p>
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <button
                      key={message._id}
                      onClick={() => handleMessageClick(message)}
                      className={`w-full p-4 border-b border-gray-100 hover:bg-blue-50 transition-all text-left ${
                        selectedMessage?._id === message._id ? 'bg-blue-50' : ''
                      } ${!message.isRead ? 'bg-blue-50/50' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className={`font-semibold ${!message.isRead ? 'text-blue-600' : 'text-gray-900'}`}>
                          {message.patientName}
                        </p>
                        {!message.isRead && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1 truncate">
                        {message.subject}
                      </p>
                      <p className="text-xs text-gray-600 truncate mb-2">
                        {message.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedMessage.subject}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="font-medium">From: {selectedMessage.patientName}</span>
                        <span>•</span>
                        <span>{selectedMessage.patientEmail}</span>
                      </div>
                    </div>
                    {selectedMessage.isRead ? (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                        Read
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedMessage.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Reply Section (Future Feature) */}
                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-4">
                    💡 <strong>Reply Feature Coming Soon!</strong> For now, please contact the patient directly at{' '}
                    <a
                      href={`mailto:${selectedMessage.patientEmail}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {selectedMessage.patientEmail}
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <div className="text-8xl mb-6">💬</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Select a message to view
                </h3>
                <p className="text-gray-600">
                  Choose a message from the list to read its contents
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
