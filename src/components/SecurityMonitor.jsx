"use client";

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Global URL monitor to catch any potential bypasses of vendor restrictions
 * This component runs on every route change to ensure compliance
 */
export default function SecurityMonitor() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only monitor if user is authenticated
    if (!isAuthenticated || !user) return;

    const { pathname, search } = location;
    const searchParams = new URLSearchParams(search);

    // Define patterns that should be restricted to vendors only
    const restrictedPatterns = [
      /\/events.*create=true/,
      /\/create-event/,
      /\/event\/create/,
      /\/new-event/,
      /\/events.*action=create/,
      /\/events.*mode=create/,
    ];

    const currentUrl = pathname + search;

    // Check if current URL matches any restricted pattern
    const isRestrictedUrl = restrictedPatterns.some((pattern) =>
      pattern.test(currentUrl)
    );

    if (isRestrictedUrl && user.role !== "vendor") {
      console.error(
        "Security violation detected: Non-vendor attempting to access restricted URL",
        {
          userRole: user.role,
          userId: user.id,
          email: user.email,
          restrictedUrl: currentUrl,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        }
      );

      // Block access and redirect to homepage
      navigate("/homepage", { replace: true });
    }
  }, [location.pathname, location.search, user, isAuthenticated, navigate]);

  return null; // This component doesn't render anything
}

// Hook to use in any component that needs to verify vendor access
export const useVendorCheck = () => {
  const { user } = useSelector((state) => state.auth);

  const is_vendor = user?.role === "vendor";

  const requireVendor = (action = "perform this action") => {
    if (!is_vendor) {
      console.warn(`Non-vendor user attempted to ${action}`, {
        userRole: user?.role,
        userId: user?.id,
        timestamp: new Date().toISOString(),
      });
      return false;
    }
    return true;
  };

  return { is_vendor, requireVendor };
};
