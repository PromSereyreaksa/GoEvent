"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../redux/slices/authSlice"
import {
  Calendar,
  Users,
  Settings,
  BarChart3,
  Clock,
  Activity,
  Star,
  Home,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react"

export default function AppSidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/sign-in")
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/homepage", active: location.pathname === "/homepage" },
    { icon: Calendar, label: "Events", href: "/events", active: location.pathname.startsWith("/events") },
    { icon: Users, label: "Guests", href: "/guests", active: location.pathname === "/guests" },
    { icon: Clock, label: "Calendar", href: "/calendar", active: location.pathname === "/calendar" },
    { icon: Activity, label: "Team", href: "/team", active: location.pathname === "/team" },
    { icon: Star, label: "Pricing", href: "/pricing", active: location.pathname === "/pricing" },
    { icon: Settings, label: "Settings", href: "/settings", active: location.pathname === "/settings" },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-blue-700 via-blue-500 to-white border-r border-blue-200 z-50 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        } ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-blue-200/50">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                
                <span className="font-bold text-xl text-white">GoEvent</span>
              </div>
            )}

            {isCollapsed && (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm mx-auto">
                <span className="text-white font-bold text-sm">GE</span>
              </div>
            )}

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Desktop collapse button */}
            {!isCollapsed && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Expand button when collapsed */}
          {isCollapsed && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* User Info */}
        {!isCollapsed && user && (
          <div className="p-4 border-b border-blue-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-white via-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-blue-700 font-medium text-sm">{user.name?.charAt(0) || "U"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name || "User"}</p>
                <p className="text-xs text-blue-100 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed User Avatar */}
        {isCollapsed && user && (
          <div className="p-4 border-b border-blue-200/50 flex justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-white via-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-blue-700 font-medium text-xs">{user.name?.charAt(0) || "U"}</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.href} className="relative group">
                <button
                  onClick={() => {
                    navigate(item.href)
                    if (window.innerWidth < 1024) onClose()
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isCollapsed ? "justify-center" : "justify-start"
                  } ${
                    item.active
                      ? "bg-white/20 text-white border border-white/30 shadow-sm"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      item.active ? "text-white" : "text-blue-200 group-hover:text-white"
                    }`}
                  />
                  {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                </button>

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-blue-200/50">
          <div className="relative group">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-blue-100 hover:bg-red-500/20 hover:text-red-200 ${
                isCollapsed ? "justify-center" : "justify-start"
              }`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium text-sm">Sign Out</span>}
            </button>

            {/* Tooltip for collapsed logout */}
            {isCollapsed && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Sign Out
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Upgrade Section */}
        {!isCollapsed && (
          <div className="p-4 border-t border-blue-200/50">
            <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-5 h-5 text-white" />
                <span className="font-semibold text-sm text-white">Upgrade Plan</span>
              </div>
              <p className="text-xs text-blue-100 mb-3">Get access to premium features and unlimited events.</p>
              <button
                onClick={() => navigate("/pricing")}
                className="w-full bg-gradient-to-r from-white via-blue-50 to-blue-100 text-blue-700 text-xs font-semibold py-2 px-3 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
