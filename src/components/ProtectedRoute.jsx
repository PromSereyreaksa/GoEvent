"use client"

import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { initializeAuth } from "../redux/slices/authSlice"

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const dispatch = useDispatch()
  const { isAuthenticated, initialized } = useSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize auth if not already done
    if (!initialized) {
      dispatch(initializeAuth())
    }

    // Set loading to false once initialized
    if (initialized) {
      setIsLoading(false)
    }
  }, [initialized, dispatch])

  // Show loading spinner while checking authentication
  if (isLoading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to sign-in if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }

  // Render protected content if authenticated
  return children
}
