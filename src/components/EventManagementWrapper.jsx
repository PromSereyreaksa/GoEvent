"use client";

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Component that wraps EventManagement to check for vendor privileges on create mode
export default function EventManagementWrapper({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, initialized } = useSelector(
    (state) => state.auth
  );

  // Check vendor privileges with useEffect to avoid immediate redirects during render
  useEffect(() => {
    if (isAuthenticated && initialized && user) {
      const searchParams = new URLSearchParams(location.search);
      const isCreateMode = searchParams.get("create") === "true";

      // If user is trying to access create mode without vendor privileges
      if (isCreateMode && user.role !== "vendor") {
        console.warn("Non-vendor user attempted to access create mode via URL", {
          userRole: user.role,
          userId: user.id,
          timestamp: new Date().toISOString(),
          path: location.pathname + location.search,
        });

        // Redirect to homepage
        navigate("/homepage", { replace: true });
      }
    }
  }, [isAuthenticated, initialized, user, location.search, location.pathname, navigate]);

  return children;
}
