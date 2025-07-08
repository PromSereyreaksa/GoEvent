"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  BarChart3,
  Clock,
  Sparkles,
  Crown,
} from "lucide-react";
import { useVendorCheck } from "../SecurityMonitor";

export default function WelcomeHero({ user }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const { is_vendor } = useVendorCheck();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    return "Welcome";
  };

  const getGreetingEmoji = () => {
    return "👋";
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-3xl shadow-xl border border-white/20 backdrop-blur-sm">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-300/30 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400/30 to-transparent rounded-full translate-y-24 -translate-x-24"></div>

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8">
          <div className="flex-1 space-y-6">
            {/* Main greeting */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent leading-tight">
                    {getGreeting()}, {user?.first_name || "User"}!
                  </h1>
                </div>
                {is_vendor && (
                  <div className="flex items-center gap-1 px-2 py-1 sm:px-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 rounded-full text-xs sm:text-sm font-semibold shadow-lg self-start sm:self-center">
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Vendor</span>
                  </div>
                )}
              </div>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl">
                Welcome back to your event management dashboard. Ready to create
                something amazing today?
              </p>
            </div>

            {/* Date and time info */}
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm border border-white/40 w-fit">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                <span className="font-medium text-gray-800 text-sm sm:text-base whitespace-nowrap">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="inline-flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm border border-white/40 w-fit">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                <span className="font-medium text-gray-800 text-sm sm:text-base whitespace-nowrap">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Vendor upgrade message */}
            {!is_vendor && (
              <div className="relative p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl shadow-sm">
                <div className="absolute top-3 right-3">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-amber-900 flex items-center gap-2 text-sm sm:text-base">
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    Unlock Vendor Features
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                    Create and manage your own events by upgrading to vendor
                    status. Join thousands of successful event organizers!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
