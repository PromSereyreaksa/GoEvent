"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronRight } from "lucide-react"

export default function NavigationCard({ title, description, icon: Icon, href, color, stats, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={` rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer group ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      onClick={() => navigate(href)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl shadow-sm">
          <Icon className="w-6 h-6 text-blue-700" />
        </div>
        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-800 group-hover:translate-x-1 transition-all duration-200" />
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-700">{description}</p>
      </div>

      {stats && (
        <div className="text-xs font-medium px-3 py-1 rounded-full inline-block bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700">
          {stats}
        </div>
      )}
    </div>
  )
}
