"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  Settings,
  Search,
  BarChart3,
  Clock,
  MapPin,
  Star,
  TrendingUp,
  Activity,
  Menu,
  Plus,
} from "lucide-react";

// Import homepage components
import { SidebarProvider } from "../components/homepage/SidebarProvider";
import AppSidebar from "../components/homepage/AppSidebar";
import UserProfileDropdown from "../components/homepage/UserProfileDropdown";
import NotificationsDropdown from "../components/homepage/NotificationsDropdown";
import QuickStatsCard from "../components/homepage/QuickStatsCard";
import NavigationCard from "../components/homepage/NavigationCard";
import RecentActivityCard from "../components/homepage/RecentActivityCard";
import WelcomeHero from "../components/homepage/WelcomeHero";
import { useVendorCheck } from "../components/SecurityMonitor";

export default function Homepage() {
  const navigate = useNavigate();
  const { is_vendor, requireVendor } = useVendorCheck();

  // User state management
  const reduxUser = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (reduxUser) {
      setUser(reduxUser);
    } else {
      const storedUser =
        JSON.parse(localStorage.getItem("user")) ||
        JSON.parse(sessionStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
      }
    }
  }, [reduxUser]);
  // Component state
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Refs for intersection observer
  const observerRef = useRef();
  const welcomeHeroRef = useRef();
  const navigationSectionRef = useRef();

  // Get dynamic data from Redux store
  const { events = [] } = useSelector((state) => state.events || {});
  const { guests = [] } = useSelector((state) => state.guests || {});

  // Global search functionality with suggestions
  const generateSearchSuggestions = (query) => {
    if (!query.trim()) return [];

    const suggestions = [];
    const lowercaseQuery = query.toLowerCase();

    // Event suggestions
    events.forEach((event) => {
      if (event.title?.toLowerCase().includes(lowercaseQuery)) {
        suggestions.push({
          type: "event",
          title: event.title,
          subtitle: "Event",
          action: () => navigate(`/events/${event.id}`),
        });
      }
    });

    // Page suggestions
    const pages = [
      { name: "Events", path: "/events" },
      { name: "Guests", path: "/guests" },
      { name: "Calendar", path: "/calendar" },
      { name: "Team", path: "/team" },
      { name: "Settings", path: "/settings" },
      { name: "Pricing", path: "/pricing" },
    ];

    pages.forEach((page) => {
      if (page.name.toLowerCase().includes(lowercaseQuery)) {
        suggestions.push({
          type: "page",
          title: page.name,
          subtitle: "Page",
          action: () => navigate(page.path),
        });
      }
    });

    return suggestions.slice(0, 5);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const suggestions = generateSearchSuggestions(query);
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      performSearch(searchQuery.trim());
    }
  };

  const performSearch = (query) => {
    const lowercaseQuery = query.toLowerCase();

    // Simple navigation based on keywords
    if (lowercaseQuery.includes("event")) {
      navigate(`/events?search=${encodeURIComponent(query)}`);
    } else if (lowercaseQuery.includes("guest")) {
      navigate(`/guests?search=${encodeURIComponent(query)}`);
    } else if (lowercaseQuery.includes("calendar")) {
      navigate("/calendar");
    } else if (lowercaseQuery.includes("team")) {
      navigate("/team");
    } else if (lowercaseQuery.includes("setting")) {
      navigate("/settings");
    } else if (lowercaseQuery.includes("pricing")) {
      navigate("/pricing");
    } else {
      // Default to events page with search
      navigate(`/events?search=${encodeURIComponent(query)}`);
    }

    setSearchQuery("");
    setShowSuggestions(false);
  };

  // Hide header when component mounts
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      header.style.display = "none";
    }

    return () => {
      if (header) {
        header.style.display = "block";
      }
    };
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  // Floating button visibility observer for vendors
  useEffect(() => {
    if (!is_vendor) return;

    // Check if we're on mobile only (not tablet)
    const isMobileOnly = () => {
      return (
        window.innerWidth < 640 && // sm breakpoint - only phones
        /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      );
    };

    const updateFloatingButtonVisibility = () => {
      if (isMobileOnly()) {
        // Only show floating button on mobile phones
        setShowFloatingButton(true);
      } else {
        // Hide floating button on tablet and desktop
        setShowFloatingButton(false);
      }
    };

    // Initial check
    updateFloatingButtonVisibility();

    // Handle window resize to adjust behavior
    const handleResize = () => {
      updateFloatingButtonVisibility();
    };

    // Debounce resize handler for better performance
    let resizeTimeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);
    window.addEventListener("orientationchange", debouncedResize);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", debouncedResize);
      window.removeEventListener("orientationchange", debouncedResize);
    };
  }, [is_vendor]);

  // Calculate dynamic stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const eventsThisMonth = events.filter((event) => {
    if (!event.date) return false;
    const eventDate = new Date(event.date);
    return (
      eventDate.getMonth() === currentMonth &&
      eventDate.getFullYear() === currentYear
    );
  }).length;

  const confirmedGuests = guests.filter(
    (guest) => guest.status === "confirmed"
  ).length;
  const activeEvents = events.filter((event) => {
    if (!event.date) return false;
    const eventDate = new Date(event.date);
    return eventDate >= new Date();
  }).length;

  // Dynamic dashboard data
  const quickStats = [
    {
      title: "Total Events",
      value: events.length.toString(),
      change:
        events.length > 0
          ? `+${Math.round((events.length / 10) * 100)}%`
          : "0%",
      trend: "up",
      icon: Calendar,
      color: "blue",
    },
    {
      title: "Active Guests",
      value: guests.length.toString(),
      change:
        confirmedGuests > 0
          ? `${Math.round((confirmedGuests / guests.length) * 100)}% confirmed`
          : "0%",
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      title: "This Month",
      value: eventsThisMonth.toString(),
      change:
        eventsThisMonth > 0 ? `${eventsThisMonth} scheduled` : "None scheduled",
      trend: eventsThisMonth > 0 ? "up" : "neutral",
      icon: TrendingUp,
      color: "blue",
    },
    {
      title: "Active Events",
      value: activeEvents.toString(),
      change: activeEvents > 0 ? `${activeEvents} upcoming` : "None upcoming",
      trend: activeEvents > 0 ? "up" : "neutral",
      icon: BarChart3,
      color: "blue",
    },
  ];

  const navigationCards = [
    // Essential cards first
    {
      title: "Event Management",
      description: "Create, edit, and manage your events",
      icon: Calendar,
      href: "/events",
      color: "blue",
      stats: `${events.length} total events`,
      priority: true,
    },
    {
      title: "Guest Management",
      description: "Manage attendees and guest lists",
      icon: Users,
      href: "/guests",
      color: "blue",
      stats: `${guests.length} total guests`,
      priority: true,
    },
  ];

  // Generate dynamic recent activities based on actual data
  const generateRecentActivities = () => {
    const activities = [];

    // Add recent events (last 5)
    const recentEvents = [...events]
      .sort(
        (a, b) =>
          new Date(b.created_at || b.date) - new Date(a.created_at || a.date)
      )
      .slice(0, 3);

    recentEvents.forEach((event, index) => {
      activities.push({
        id: `event_${event.id}`,
        type: "event_created",
        title: "Event created",
        description: event.title || `Event ${event.id}`,
        time: event.created_at
          ? new Date(event.created_at).toLocaleDateString()
          : "Recently",
        icon: Calendar,
        color: "blue",
      });
    });

    // Add recent guest activities
    const recentGuests = [...guests]
      .sort(
        (a, b) =>
          new Date(b.invitedAt || b.updatedAt) -
          new Date(a.invitedAt || a.updatedAt)
      )
      .slice(0, 2);

    recentGuests.forEach((guest) => {
      activities.push({
        id: `guest_${guest.id}`,
        type: "guest_invited",
        title: "Guest invited",
        description: `${guest.name} invited`,
        time: guest.invitedAt
          ? new Date(guest.invitedAt).toLocaleDateString()
          : "Recently",
        icon: Users,
        color: "blue",
      });
    });

    // If no activities, show placeholder
    if (activities.length === 0) {
      activities.push({
        id: "welcome",
        type: "welcome",
        title: "Welcome to GoEvent!",
        description: "Start by creating your first event",
        time: "Now",
        icon: Calendar,
        color: "blue",
      });
    }

    return activities.slice(0, 4); // Limit to 4 activities
  };

  const recentActivities = generateRecentActivities();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans'] w-full">
        <AppSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />

        {/* Main Content - with proper margin for sidebar */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
          }`}
        >
          {/* Top Navigation Bar */}
          <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200/60 px-4 sm:px-6 lg:px-8 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search events, guests, or pages..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearch}
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 200)
                    }
                    className="pl-10 pr-4 py-2.5 w-full bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm"
                  />

                  {/* Search Suggestions Dropdown */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={suggestion.action}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {suggestion.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {suggestion.subtitle}
                              </div>
                            </div>
                            <Search className="w-3 h-3 text-gray-400" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <NotificationsDropdown />
                <UserProfileDropdown user={user} />
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Welcome Hero Section */}
            <div ref={welcomeHeroRef}>
              <WelcomeHero user={user} />
            </div>

            {/* Quick Stats */}
            <div
              id="stats-section"
              data-animate
              className={`transition-all duration-700 ${
                isVisible["stats-section"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStats.map((stat, index) => (
                  <QuickStatsCard key={index} {...stat} delay={index * 100} />
                ))}
              </div>
            </div>

            {/* Navigation Cards */}
            <div
              ref={navigationSectionRef}
              id="navigation-section"
              data-animate
              className={`transition-all duration-700 delay-200 ${
                isVisible["navigation-section"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Quick Access
                    </h2>
                    <p className="text-gray-600">
                      Navigate to different sections of your dashboard
                    </p>
                  </div>
                  {/* Quick Create Button for Vendors */}
                  {is_vendor && (
                    <button
                      onClick={() => navigate("/events/create")}
                      className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                      Create Event
                    </button>
                  )}
                </div>
              </div>

              {/* Priority Cards (larger on mobile) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {navigationCards
                  .filter((card) => card.priority)
                  .map((card, index) => (
                    <NavigationCard key={index} {...card} delay={index * 100} />
                  ))}
              </div>

              {/* Secondary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {navigationCards
                  .filter((card) => !card.priority)
                  .map((card, index) => (
                    <NavigationCard
                      key={index}
                      {...card}
                      delay={(index + 2) * 100}
                    />
                  ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div
              id="activity-section"
              data-animate
              className={`transition-all duration-700 delay-400 ${
                isVisible["activity-section"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <RecentActivityCard activities={recentActivities} />
            </div>
          </div>
        </div>

        {/* Smart Floating Action Button for Vendors */}
        {is_vendor && (
          <div
            className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
              showFloatingButton
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-75 pointer-events-none"
            }`}
          >
            <div className="relative group">
              <button
                onClick={() => navigate("/events/create")}
                className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700"
                title="Create New Event"
              >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
              </button>

              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Create New Event
                <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
}
