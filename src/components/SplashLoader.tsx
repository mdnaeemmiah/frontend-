"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../assets/logo.png";

export default function SplashLoader({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if user has already seen the splash screen in this session
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");

    if (!hasSeenSplash) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("hasSeenSplash", "true");
        setIsReady(true);
      }, 3000); // 3 seconds duration
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
    }
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#2952A1] text-white">
        <div className="max-w-xl w-full text-center px-4">
          <Image
            src={logo}
            alt="Nova Health Logo"
            className="w-full h-auto"
            priority
          />
          <p className="mb-8 text-lg">Find the right doctor. Feel confident.</p>

          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-3 h-3 bg-[#26c6da] rounded-full animate-pulse inline-block"></span>
            <span className="w-3 h-3 bg-[#6ee7b7] rounded-full animate-pulse inline-block delay-200"></span>
            <span className="w-3 h-3 bg-white rounded-full animate-pulse inline-block delay-400"></span>
          </div>

          <p className="opacity-90">Loading your health journey...</p>
        </div>
      </div>
    );
  }

  // Only render children after checking splash status to avoid flicker
  if (!isReady) return null;

  return <>{children}</>;
}
