"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function NavigationCard({
  title,
  description,
  icon: Icon,
  href,
  color,
  stats,
  delay = 0,
  priority = false,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-700",
      stats: "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700",
      priorityBg:
        "bg-gradient-to-b sm:bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-700",
      stats: "bg-gradient-to-r from-green-100 to-green-50 text-green-700",
      priorityBg:
        "bg-gradient-to-b sm:bg-gradient-to-r from-green-400 via-green-500 to-green-600",
    },
    gray: {
      bg: "bg-gray-50",
      border: "border-gray-200",
      icon: "text-gray-700",
      stats: "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700",
      priorityBg:
        "bg-gradient-to-b sm:bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600",
    },
    yellow: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: "text-yellow-700",
      stats: "bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700",
      priorityBg:
        "bg-gradient-to-b sm:bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600",
    },
  };

  const currentColor = colorClasses[color] || colorClasses.blue;

  return (
    <div
      className={`${
        priority ? currentColor.priorityBg : currentColor.bg
      } rounded-2xl p-6 ${
        priority
          ? "shadow-xl hover:shadow-2xl"
          : `shadow-lg ${currentColor.border}`
      } hover:shadow-xl transition-all duration-300 cursor-pointer group ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${priority ? "transform hover:scale-105" : ""}`}
      onClick={() => navigate(href)}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-3 rounded-xl shadow-sm ${
            priority ? "bg-white/20 backdrop-blur-sm" : currentColor.bg
          }`}
        >
          <Icon
            className={`w-6 h-6 ${priority ? "text-white" : currentColor.icon}`}
          />
        </div>
        <ChevronRight
          className={`w-5 h-5 ${
            priority
              ? "text-white/80 group-hover:text-white"
              : "text-gray-600 group-hover:text-gray-800"
          } group-hover:translate-x-1 transition-all duration-200`}
        />
      </div>

      <div className="mb-4">
        <h3
          className={`text-lg font-semibold mb-2 transition-colors ${
            priority
              ? "text-xl font-bold text-white group-hover:text-white/90"
              : "text-gray-900 group-hover:text-gray-800"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-sm ${priority ? "text-white/90" : "text-gray-700"}`}
        >
          {description}
        </p>
      </div>

      {stats && (
        <div
          className={`text-xs font-medium px-3 py-1 rounded-full inline-block ${
            priority
              ? "bg-white/20 backdrop-blur-sm text-white shadow-md"
              : currentColor.stats
          }`}
        >
          {stats}
        </div>
      )}
    </div>
  );
}
