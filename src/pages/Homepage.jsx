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

  const navigate = useNavigate();

  const { is_vendor, requireVendor } = useVendorCheck();
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const observerRef = useRef();
  const welcomeHeroRef = useRef();
  const navigationSectionRef = useRef();

  // Global search functionality
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      performSearch(searchQuery.trim());
    }
  };

  const performSearch = (query) => {
    const lowercaseQuery = query.toLowerCase();
    
    // Search in events
    const matchingEvents = events.filter(event =>
      event.title?.toLowerCase().includes(lowercaseQuery) ||
      event.description?.toLowerCase().includes(lowercaseQuery) ||
      event.venue_name?.toLowerCase().includes(lowercaseQuery) ||
      event.category?.toLowerCase().includes(lowercaseQuery)
    );

    // Search in guests
    const matchingGuests = guests.filter(guest =>
      guest.name?.toLowerCase().includes(lowercaseQuery) ||
      guest.email?.toLowerCase().includes(lowercaseQuery)
    );

    // Navigation logic based on search results
    if (matchingEvents.length > 0) {
      // If we found events, navigate to events page with search applied
      navigate(`/events?search=${encodeURIComponent(query)}`);
    } else if (matchingGuests.length > 0) {
      // If we found guests, navigate to guests page with search applied
      navigate(`/guests?search=${encodeURIComponent(query)}`);
    } else if (lowercaseQuery.includes('setting')) {
      navigate('/settings');
    } else if (lowercaseQuery.includes('team') || lowercaseQuery.includes('collaborat')) {
      navigate('/team');
    } else if (lowercaseQuery.includes('calendar')) {
      navigate('/calendar');
    } else if (lowercaseQuery.includes('pricing')) {
      navigate('/pricing');
    } else {
      // No results found - show alert or navigate to search results page
      alert(`No results found for "${query}". Try searching for events, guests, or page names.`);
    }
    
    // Clear search after performing search
    setSearchQuery('');
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

    const createButtonObserver = new IntersectionObserver(
      (entries) => {
        let anyCreateButtonVisible = false;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            anyCreateButtonVisible = true;
          }
        });

        // Show floating button only when create event buttons are not visible
        setShowFloatingButton(!anyCreateButtonVisible);
      },
      {
        threshold: [0, 0.1, 0.5, 1],
        rootMargin: "-50px 0px -50px 0px", // Give some margin for better UX
      }
    );

    // Observe create event elements when they're available
    const observeCreateElements = () => {
      if (welcomeHeroRef.current) {
        createButtonObserver.observe(welcomeHeroRef.current);
      }
      if (navigationSectionRef.current) {
        createButtonObserver.observe(navigationSectionRef.current);
      }
    };

    // Delay observation to ensure elements are rendered
    const timer = setTimeout(observeCreateElements, 100);

    return () => {
      clearTimeout(timer);
      createButtonObserver.disconnect();
    };
  }, [is_vendor]);

  // Get dynamic data from Redux store
  const { events = [] } = useSelector((state) => state.events || {});
  const { guests = [] } = useSelector((state) => state.guests || {});

  // Calculate dynamic stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const eventsThisMonth = events.filter(event => {
    if (!event.date) return false;
    const eventDate = new Date(event.date);
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
  }).length;

  const confirmedGuests = guests.filter(guest => guest.status === 'confirmed').length;
  const activeEvents = events.filter(event => {
    if (!event.date) return false;
    const eventDate = new Date(event.date);
    return eventDate >= new Date();
  }).length;

  // Dynamic dashboard data
  const quickStats = [
    {
      title: "Total Events",
      value: events.length.toString(),
      change: events.length > 0 ? `+${Math.round((events.length / 10) * 100)}%` : "0%",
      trend: "up",
      icon: Calendar,
      color: "blue",
    },
    {
      title: "Active Guests",
      value: guests.length.toString(),
      change: confirmedGuests > 0 ? `${Math.round((confirmedGuests / guests.length) * 100)}% confirmed` : "0%",
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      title: "This Month",
      value: eventsThisMonth.toString(),
      change: eventsThisMonth > 0 ? `${eventsThisMonth} scheduled` : "None scheduled",
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
    // Add Create Event card for vendors as first priority
    ...(is_vendor
      ? [
          {
            title: "Create New Event",
            description: "Start planning your next amazing event",
            icon: Plus,
            href: "/events?create=true",
            color: "green",
            stats: "Quick & Easy Setup",
            priority: true,
          },
        ]
      : []),
    {
      title: "Event Management",
      description: "Create, edit, and manage your events",
      icon: Calendar,
      href: "/events",
      color: "blue",
      stats: `${events.length} total events`,
    },
    {
      title: "Guest Management",
      description: "Manage attendees and guest lists",
      icon: Users,
      href: "/guests",
      color: "blue",
      stats: `${guests.length} total guests`,
    },
    {
      title: "Calendar View",
      description: "View all events in calendar format",
      icon: Clock,
      href: "/calendar",
      color: "blue",
      stats: "8 events this month",
    },
    {
      title: "Team Collaboration",
      description: "Work together with your team",
      icon: Activity,
      href: "/team",
      color: "blue",
      stats: "5 team members",
    },
    {
      title: "Pricing Plans",
      description: "Manage your subscription and billing",
      icon: Star,
      href: "/pricing",
      color: "blue",
      stats: "Pro plan active",
    },
    {
      title: "Settings",
      description: "Configure your account preferences",
      icon: Settings,
      href: "/settings",
      color: "blue",
      stats: "Last updated 2 days ago",
    },
  ];

  // Generate dynamic recent activities based on actual data
  const generateRecentActivities = () => {
    const activities = [];
    
    // Add recent events (last 5)
    const recentEvents = [...events]
      .sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date))
      .slice(0, 3);
    
    recentEvents.forEach((event, index) => {
      activities.push({
        id: `event_${event.id}`,
        type: "event_created",
        title: "Event created",
        description: event.title || `Event ${event.id}`,
        time: event.created_at ? new Date(event.created_at).toLocaleDateString() : "Recently",
        icon: Calendar,
        color: "blue",
      });
    });

    // Add recent guest activities
    const recentGuests = [...guests]
      .sort((a, b) => new Date(b.invitedAt || b.updatedAt) - new Date(a.invitedAt || a.updatedAt))
      .slice(0, 2);

    recentGuests.forEach((guest) => {
      activities.push({
        id: `guest_${guest.id}`,
        type: "guest_invited",
        title: "Guest invited",
        description: `${guest.name} invited`,
        time: guest.invitedAt ? new Date(guest.invitedAt).toLocaleDateString() : "Recently",
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-['Plus_Jakarta_Sans']">
        <AppSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content - with proper margin for sidebar */}
        <div className="lg:ml-64 transition-all duration-300">
          {/* Top Navigation Bar */}
          <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-4 sm:px-6 lg:px-8 py-4">
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
                    placeholder="Search events, guests, or settings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => performSearch(searchQuery)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-blue-600 hover:text-blue-800"
                      title="Search"
                    >
                      <Search className="w-4 h-4" />
                    </button>
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
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Quick Access
                </h2>
                <p className="text-gray-600">
                  Navigate to different sections of your dashboard
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {navigationCards.map((card, index) => (
                  <NavigationCard key={index} {...card} delay={index * 100} />
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
        <div
          className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
            is_vendor && showFloatingButton
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-75 pointer-events-none"
          }`}
        >
          <button
            onClick={() =>
              requireVendor("create events") && navigate("/events?create=true")
            }
            className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 group"
            title="Create New Event"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </SidebarProvider>
  );
}
