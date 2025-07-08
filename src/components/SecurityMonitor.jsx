"use client"

import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"

export const useVendorCheck = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  // Debug logging to see what we're getting from Redux
  console.log("useVendorCheck - Debug Info:", {
    isAuthenticated,
    user,
    is_vendor: user?.is_vendor,
    userType: typeof user?.is_vendor,
  })

  // Check the is_vendor boolean from the JWT response
  const is_vendor = isAuthenticated && user?.is_vendor === true

  const requireVendor = (action = "perform this action") => {
    if (!isAuthenticated) {
      navigate("/sign-in")
      return false
    }

    if (!is_vendor) {
      console.warn(`Vendor access required to ${action}`, {
        userRole: user?.role,
        isVendor: user?.is_vendor,
        userId: user?.id,
        timestamp: new Date().toISOString(),
      })
      return false
    }

    return true
  }

  return {
    is_vendor,
    requireVendor,
    user,
    isAuthenticated,
  }
}

export default function SecurityMonitor() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    // Only redirect if user is not authenticated and trying to access protected routes
    const protectedPaths = ["/dashboard", "/homepage", "/events", "/guests", "/checkout", "/reviews"]
    const currentPath = location.pathname

    if (!isAuthenticated && protectedPaths.some((path) => currentPath.startsWith(path))) {
      navigate("/sign-in")
    }
  }, [location.pathname, isAuthenticated, navigate])

  return null
}