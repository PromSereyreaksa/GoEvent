"use client";

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Wrapper component that specifically protects the create event URL parameter
 * Redirects non-vendors away from ?create=true URLs
 */
export default function CreateEventProtection({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, initialized } = useSelector(
    (state) => state.auth
  );

  // Immediate check - no useEffect delay
  if (isAuthenticated && initialized && user) {
    const searchParams = new URLSearchParams(location.search);
    const isCreateMode = searchParams.get("create") === "true";

    // Block non-vendors from accessing create mode URLs
    if (isCreateMode && user.role !== "vendor") {
      console.warn("Unauthorized create event access attempt blocked", {
        userRole: user.role,
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
        originalUrl: location.pathname + location.search,
        userAgent: navigator.userAgent,
      });

      // Immediate redirect to homepage
      navigate("/homepage", { replace: true });
      return null; // Don't render anything while redirecting
    }
  }

  return children;
}
