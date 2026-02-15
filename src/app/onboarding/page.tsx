/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import logo from "../../assets/image/attachment-removebg-preview 1.svg";
import logo1 from "../../assets/image/div.png";
import Image from "next/image";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const questions = [
    "I prefer a structured approach when learning something new.",
    "I feel more comfortable where I know anyone things in detail.",
    "I prefer quick and efficient appointments rather than discussing.",
    "I feel comfortable asking questions about my health.",
    "I value doctors who include me in decision-making.",
    "I feel anxious or nervous before medical appointments.",
    "I prefer direct communication with my healthcare providers.",
    "Consistency and follow up matter to me in healthcare.",
    "I prefer healthcare experience that respect my time.",
  ];

  const [responses, setResponses] = useState<{ [key: number]: number }>({});
  const [activeQuestion, setActiveQuestion] = useState(0);

  // Auto-activate next question when current is answered
  useEffect(() => {
    if (responses[activeQuestion] !== undefined && activeQuestion < questions.length - 1) {
      const timer = setTimeout(() => {
        setActiveQuestion(activeQuestion + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [responses, activeQuestion, questions.length]);

  // Auto-submit when all questions are answered
  useEffect(() => {
    if (Object.keys(responses).length === questions.length) {
      const timer = setTimeout(() => {
        handleSubmit();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [responses, questions.length]);

  const handleRatingClick = (questionIndex: number, rating: number) => {
    if (questionIndex !== activeQuestion) return;
    setResponses({ ...responses, [questionIndex]: rating });
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/matches");
    }, 1000);
  };

  const ratingConfig = [
    { rating: 1, label: "1", color: "#B91C1C", size: "w-12 h-12 text-lg" },
    { rating: 2, label: "2", color: "#EF4444", size: "w-10 h-10 text-md" },
    { rating: 3, label: "3", color: "#F87171", size: "w-8 h-8 text-sm" },
    { rating: 4, label: "4", color: "#D1D5DB", size: "w-7 h-7 text-xs" },
    { rating: 5, label: "1", color: "#A3E635", size: "w-8 h-8 text-sm" },
    { rating: 6, label: "2", color: "#22C55E", size: "w-10 h-10 text-md" },
    { rating: 7, label: "3", color: "#059669", size: "w-12 h-12 text-lg" },
  ];

  return (
    <div className="min-h-screen bg-[#2952A1] flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-3xl">
        {/* Main Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 relative">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#2952A1] rounded-full flex items-center justify-center mr-2">
                    <Image
                src={logo1}
                alt="Logo"
                width={80}
                height={80}
                className="object-contain"
              />
              </div>
              <Image
                src={logo}
                alt="Logo"
                width={100}
                height={100}
                className="object-contain h-[30px] sm:h-[40px] w-auto"
              />
            </div>
            <p className="text-lg sm:text-xl font-bold text-gray-600">Help us understand you better</p>
            
            {/* Progress Bar */}
            <div className="mt-6 sm:mt-12 px-2 sm:px-4">
              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                <div
                  className="bg-[#2952A1] h-1.5 sm:h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(Object.keys(responses).length / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Questions Container */}
          <div className="space-y-12 sm:space-y-16">
            {questions.map((question, index) => {
            const isActive = index === activeQuestion;
            const isAnswered = responses[index] !== undefined;
            const isLocked = index > activeQuestion;

            return (
              <div
                key={index}
                className={`transition-all duration-500 transform ${
                  isLocked ? "opacity-20 pointer-events-none scale-95" : "opacity-100 scale-100"
                } ${isActive ? "ring-0" : ""}`}
              >
                <div className="flex flex-col items-center">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-800 text-center mb-6 sm:mb-10 max-w-2xl px-2 sm:px-4">
                    {question}
                  </h2>

                  <div className="w-full max-w-xl px-2 sm:px-6">
                    <div className="flex justify-between items-end mb-4 sm:mb-6">
                      <span className="text-red-400 font-medium text-sm sm:text-lg ml-1 sm:ml-2">Disagree</span>
                      <span className="text-green-500 font-medium text-sm sm:text-lg mr-1 sm:mr-2">Agree</span>
                    </div>

                    <div className="flex justify-between items-center h-12 sm:h-16 gap-1">
                      {ratingConfig.map((item) => {
                        const isSelected = responses[index] === item.rating;
                        const pastelColor = item.color + "40"; // 25% opacity for pastel look

                        // Dynamic sizes for mobile responsive
                        const sizeClasses = item.rating === 1 || item.rating === 7 
                          ? "w-8 h-8 sm:w-12 sm:h-12 text-sm sm:text-lg"
                          : item.rating === 2 || item.rating === 6
                          ? "w-7 h-7 sm:w-10 sm:h-10 text-xs sm:text-md"
                          : item.rating === 3 || item.rating === 5
                          ? "w-6 h-6 sm:w-8 sm:h-8 text-[10px] sm:text-sm"
                          : "w-5 h-5 sm:w-7 sm:h-7 text-[8px] sm:text-xs";

                        return (
                          <button
                            key={item.rating}
                            type="button"
                            onClick={() => handleRatingClick(index, item.rating)}
                            className={`rounded-full flex items-center justify-center transition-all duration-300 ${sizeClasses} ${
                              isActive
                                ? "hover:scale-110 active:scale-95 cursor-pointer"
                                : "cursor-default"
                            }`}
                            style={{
                              backgroundColor: isSelected ? item.color : (isActive ? pastelColor : "#F3F4F6"),
                              color: isSelected ? "white" : (isActive ? item.color : "#9CA3AF"),
                              border: isSelected ? `2px solid #0f172a` : "none",
                              fontWeight: isSelected ? "bold" : "normal",
                            }}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {loading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2952A1] border-t-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}
