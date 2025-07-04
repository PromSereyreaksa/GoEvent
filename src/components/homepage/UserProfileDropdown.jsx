"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { logout } from "../../redux/slices/authSlice"
import { User, Settings, LogOut, ChevronDown, Crown, Bell, HelpCircle } from "lucide-react"

export default function UserProfileDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
  }

  const menuItems = [
    {
      icon: User,
      label: "Profile",
      onClick: () => navigate("/profile"),
    },
    {
      icon: Settings,
      label: "Settings",
      onClick: () => navigate("/settings"),
    },
    {
      icon: Crown,
      label: "Upgrade Plan",
      onClick: () => navigate("/pricing"),
      highlight: true,
    },
    {
      icon: Bell,
      label: "Notifications",
      onClick: () => navigate("/notifications"),
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      onClick: () => navigate("/help"),
    },
    {
      icon: LogOut,
      label: "Sign Out",
      onClick: handleLogout,
      danger: true,
    },
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">{user?.name?.charAt(0) || "U"}</span>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-gray-900">{user?.name || "User"}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role || "Member"}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">{user?.name?.charAt(0) || "U"}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user?.name || "User"}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Crown className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-gray-600 capitalize">{user?.role || "Member"} Plan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick()
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                    item.danger
                      ? "text-red-600 hover:bg-red-50"
                      : item.highlight
                        ? "text-blue-700 hover:bg-purple-50"
                        : "text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.highlight && (
                    <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">Pro</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
