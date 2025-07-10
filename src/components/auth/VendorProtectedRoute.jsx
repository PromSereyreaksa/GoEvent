"use client";

import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { initializeAuth } from "../redux/slices/authSlice";
import { AlertTriangle, Lock } from "lucide-react";

export default function VendorProtectedRoute({ children }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, initialized, user } = useSelector(
    (state) => state.auth
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth if not already done
    if (!initialized) {
      dispatch(initializeAuth());
    }

    // Set loading to false once initialized
    if (initialized) {
      setIsLoading(false);
    }
  }, [initialized, dispatch]);

  // Show loading spinner while checking authentication
  if (isLoading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Check if user is vendor
  if (user?.role !== "vendor") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-['Plus_Jakarta_Sans']">
        <div className="max-w-md w-full mx-auto text-center p-8">
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
            {/* Access Denied Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-red-600" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>

            {/* Message */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              This feature is only available for vendor accounts. You need
              vendor privileges to create and manage events.
            </p>

            {/* User Info */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    Current Role
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    {user?.role || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.history.back()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                Go Back
              </button>
              <button
                onClick={() => Navigate("/homepage")}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render vendor content if user has vendor role
  return children;
}
