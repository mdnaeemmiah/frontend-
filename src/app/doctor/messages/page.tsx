"use client";

import { useState } from "react";

interface Message {
  _id: string;
  patientName: string;
  patientEmail: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Static messages data
const STATIC_MESSAGES: Message[] = [
  {
    _id: "1",
    patientName: "John Smith",
    patientEmail: "john.smith@email.com",
    subject: "Question about my blood pressure medication",
    message: "Hello Dr. Johnson,\n\nI hope this message finds you well. I wanted to ask about the blood pressure medication you prescribed during my last visit. I've been taking it for two weeks now, and I've noticed some mild dizziness in the mornings. Is this normal? Should I be concerned?\n\nAlso, I wanted to confirm the dosage - is it one tablet in the morning or evening?\n\nThank you for your time.\n\nBest regards,\nJohn Smith",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    _id: "2",
    patientName: "Emily Johnson",
    patientEmail: "emily.j@email.com",
    subject: "Follow-up appointment scheduling",
    message: "Dear Dr. Johnson,\n\nThank you for the excellent care during my cardiac evaluation last week. As you recommended, I would like to schedule a follow-up appointment in 3 months.\n\nCould you please let me know your available dates in April? I prefer morning appointments if possible.\n\nLooking forward to hearing from you.\n\nWarm regards,\nEmily Johnson",
    isRead: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
  {
    _id: "3",
    patientName: "Michael Brown",
    patientEmail: "m.brown@email.com",
    subject: "Urgent: Chest pain concerns",
    message: "Dr. Johnson,\n\nI've been experiencing some chest discomfort since yesterday evening. It's not severe, but it's persistent. The pain is mild and feels like pressure on my chest.\n\nI have my appointment scheduled for tomorrow, but I wanted to inform you beforehand. Should I come in earlier or is tomorrow's appointment fine?\n\nPlease advise.\n\nThank you,\nMichael Brown",
    isRead: false,
    createdAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
  },
  {
    _id: "4",
    patientName: "Sarah Davis",
    patientEmail: "sarah.davis@email.com",
    subject: "Test results inquiry",
    message: "Hello Dr. Johnson,\n\nI had my ECG test done last Friday as you recommended. I was wondering if the results are available yet? I'm a bit anxious to know the outcome.\n\nIf the results are ready, could you please share them with me or let me know when we can discuss them?\n\nThank you for your care and attention.\n\nBest,\nSarah Davis",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    _id: "5",
    patientName: "David Wilson",
    patientEmail: "d.wilson@email.com",
    subject: "Prescription renewal request",
    message: "Dear Dr. Johnson,\n\nI hope you're doing well. I'm running low on my beta blocker medication and would like to request a prescription renewal.\n\nI've been taking the medication as prescribed, and it's been working well for me. No side effects or concerns to report.\n\nCould you please send the prescription to my usual pharmacy?\n\nThank you very much.\n\nRegards,\nDavid Wilson",
    isRead: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
  {
    _id: "6",
    patientName: "Lisa Anderson",
    patientEmail: "lisa.anderson@email.com",
    subject: "Thank you for the excellent care",
    message: "Dr. Johnson,\n\nI just wanted to send a quick message to thank you for the wonderful care you provided during my recent visit. Your thorough examination and clear explanations really put my mind at ease.\n\nI'm following all your recommendations and already feeling much better. The lifestyle changes you suggested are making a real difference.\n\nI truly appreciate your expertise and compassionate approach to patient care.\n\nWith gratitude,\nLisa Anderson",
    isRead: true,
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
  },
];

export default function DoctorMessagesPage() {
  const [messages] = useState<Message[]>(STATIC_MESSAGES);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
  };

  const filteredMessages = messages
    .filter((msg) => {
      if (filter === "unread") return !msg.isRead;
      if (filter === "read") return msg.isRead;
      return true;
    })
    .filter(
      (msg) =>
        msg.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const unreadCount = messages.filter((msg) => !msg.isRead).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">Communicate with your patients</p>
          </div>
          {unreadCount > 0 && (
            <span className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-semibold">
              {unreadCount} new
            </span>
          )}
        </div>
      </div>

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
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2952a1] focus:border-transparent mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === "all"
                      ? "bg-[#2952a1] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All ({messages.length})
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === "unread"
                      ? "bg-[#2952a1] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter("read")}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === "read"
                      ? "bg-[#2952a1] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                  <p className="text-gray-600 font-medium">
                    No messages found
                  </p>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <button
                    key={message._id}
                    onClick={() => handleMessageClick(message)}
                    className={`w-full p-4 border-b border-gray-100 hover:bg-[#ebe2cd]/30 transition-all text-left ${
                      selectedMessage?._id === message._id ? "bg-[#ebe2cd]/50" : ""
                    } ${!message.isRead ? "bg-blue-50/50" : ""}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p
                        className={`font-semibold ${
                          !message.isRead ? "text-[#2952a1]" : "text-gray-900"
                        }`}
                      >
                        {message.patientName}
                      </p>
                      {!message.isRead && (
                        <span className="w-2 h-2 bg-[#2952a1] rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1 truncate">
                      {message.subject}
                    </p>
                    <p className="text-xs text-gray-600 truncate mb-2">
                      {message.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
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
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-medium">
                        From: {selectedMessage.patientName}
                      </span>
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
                  {new Date(selectedMessage.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Reply Section */}
              <div className="mt-8 p-6 bg-[#ebe2cd]/30 rounded-xl">
                <p className="text-sm text-gray-700 mb-4">
                  💡 <strong>Reply Feature Coming Soon!</strong> For now,
                  please contact the patient directly at{" "}
                  <a
                    href={`mailto:${selectedMessage.patientEmail}`}
                    className="text-[#2952a1] hover:text-[#1e3d7a] font-medium"
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
    </div>
  );
}
