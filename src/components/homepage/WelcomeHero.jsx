"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Users, Plus, BarChart3 } from "lucide-react"

export default function WelcomeHero({ user }) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const quickActions = [
    {
      icon: Plus,
      label: "Create Event",
      action: () => navigate("/events"),
      color: "from-blue-600 to-blue-700",
    },
    {
      icon: Users,
      label: "Manage Guests",
      action: () => navigate("/guests"),
      color: "from-green-600 to-green-700",
    },
    {
      icon: BarChart3,
      label: "View Analytics",
      action: () => navigate("/analytics"),
      color: "from-purple-600 to-purple-700",
    },
  ]

  return (
    <div className=" rounded-2xl p-8 shadow-lg border border-blue-200">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {user?.name || "User"}! 
          </h1>
          <p className="text-gray-700 mb-4">
            Welcome back to your event management dashboard. Here's what's happening today.
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <button
                key={index}
                onClick={action.action}
                className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${action.color} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{action.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
