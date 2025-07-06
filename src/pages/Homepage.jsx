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

  // Mock data for dashboard
  const quickStats = [
    {
      title: "Total Events",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: Calendar,
      color: "blue",
    },
    {
      title: "Active Guests",
      value: "1,247",
      change: "+8%",
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      title: "This Month",
      value: "8",
      change: "+3",
      trend: "up",
      icon: TrendingUp,
      color: "blue",
    },
    {
      title: "Revenue",
      value: "$12,450",
      change: "+15%",
      trend: "up",
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
      stats: "24 active events",
    },
    {
      title: "Guest Management",
      description: "Manage attendees and guest lists",
      icon: Users,
      href: "/guests",
      color: "blue",
      stats: "1,247 total guests",
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

  const recentActivities = [
    {
      id: 1,
      type: "event_created",
      title: "New event created",
      description: "Summer Music Festival 2024",
      time: "2 hours ago",
      icon: Calendar,
      color: "blue",
    },
    {
      id: 2,
      type: "guest_registered",
      title: "New guest registered",
      description: "John Doe registered for Tech Conference",
      time: "4 hours ago",
      icon: Users,
      color: "blue",
    },
    {
      id: 3,
      type: "event_updated",
      title: "Event updated",
      description: "Wedding Reception venue changed",
      time: "1 day ago",
      icon: MapPin,
      color: "blue",
    },
    {
      id: 4,
      type: "team_invite",
      title: "Team member invited",
      description: "Sarah Johnson invited to Marketing Team",
      time: "2 days ago",
      icon: Activity,
      color: "blue",
    },
  ];

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
                    className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
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
