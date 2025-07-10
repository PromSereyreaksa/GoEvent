"use client";

import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Role-based protected route component
 * Redirects users without required roles to fallback routes
 */
export default function RoleProtectedRoute({
  children,
  requiredRole,
  requiredRoles = [],
  fallbackRoute = "/homepage",
  errorMessage = "You don't have permission to access this page.",
}) {
  const location = useLocation();
  const { user, isAuthenticated, initialized } = useSelector(
    (state) => state.auth
  );

  // Check role requirements immediately
  const userRole = user?.role;
  const hasRequiredRole = requiredRole
    ? userRole === requiredRole
    : requiredRoles.length > 0
    ? requiredRoles.includes(userRole)
    : true;

  // Show loading if auth not initialized
  if (!initialized) {
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

  // If user doesn't have required role, redirect immediately
  if (!hasRequiredRole) {
    // Log unauthorized access attempt
    console.warn(
      `Unauthorized access attempt: User with role "${userRole}" tried to access route requiring role(s): ${
        requiredRole || requiredRoles.join(", ")
      }`
    );

    // Direct redirect to fallback route (homepage)
    return <Navigate to={fallbackRoute} replace />;
  }

  // If user has required role, render children
  return children;
}
