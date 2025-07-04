"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

export default function QuickStatsCard({ title, value, change, trend, icon: Icon, color, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-md transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl shadow-sm">
          <Icon className="w-6 h-6 text-blue-700" />
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === "up"
              ? "text-green-700 bg-gradient-to-r from-green-100 to-green-50"
              : "text-red-700 bg-gradient-to-r from-red-100 to-red-50"
          }`}
        >
          {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{change}</span>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-700">{title}</p>
      </div>
    </div>
  )
}
