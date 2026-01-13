"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DoctorVideo() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentVideo();
  }, []);

  const fetchCurrentVideo = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || "https://practice-backend-oauth-image-video.vercel.app"}/api/user/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();
      if (result.success && result.data.introVideo) {
        setCurrentVideo(result.data.introVideo);
      }
    } catch (error) {
      console.error("Error fetching video:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert("File size must be less than 50MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("video/")) {
        alert("Please select a video file");
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a video file");
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("video", selectedFile);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API || "https://practice-backend-oauth-image-video.vercel.app"}/api/doctor/my-intro-video`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Video uploaded successfully!");
        setCurrentVideo(result.data.introVideo);
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        alert(result.message || "Failed to upload video");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push("/doctor/dashboard")}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Intro Video</h1>
          <p className="text-gray-600">
            Upload a 1-minute video introducing yourself to patients
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
          {/* Current Video */}
          {currentVideo && !previewUrl && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Current Video
              </h2>
              <div className="bg-gray-100 rounded-2xl overflow-hidden">
                <video src={currentVideo} controls className="w-full max-h-96">
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}

          {/* Preview New Video */}
          {previewUrl && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Preview New Video
              </h2>
              <div className="bg-gray-100 rounded-2xl overflow-hidden">
                <video src={previewUrl} controls className="w-full max-h-96">
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Selected:</strong> {selectedFile?.name} (
                  {(selectedFile!.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              </div>
            </div>
          )}

          {/* Upload Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {currentVideo ? "Update Video" : "Upload Video"}
            </h2>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-500 transition-colors">
              <div className="mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🎥</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedFile ? "Change Video" : "Select a Video"}
                </h3>
                <p className="text-gray-600 mb-4">
                  Upload a video introducing yourself (max 50MB, recommended 1
                  minute)
                </p>
              </div>

              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 cursor-pointer transition-colors"
              >
                Choose Video File
              </label>
            </div>

            {/* Tips */}
            <div className="mt-6 p-6 bg-purple-50 rounded-2xl border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-3">
                💡 Video Tips:
              </h3>
              <ul className="space-y-2 text-sm text-purple-800">
                <li>
                  • Keep it around 1 minute - patients appreciate concise
                  introductions
                </li>
                <li>• Introduce yourself and your specialization</li>
                <li>• Share your approach to patient care</li>
                <li>• Mention what makes you unique</li>
                <li>• Speak clearly and smile - be yourself!</li>
                <li>• Good lighting and clear audio are important</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Uploading...
                </span>
              ) : (
                "Upload Video"
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push("/doctor/dashboard")}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
