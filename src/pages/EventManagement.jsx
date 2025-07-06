"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu } from "lucide-react";
import AppSidebar from "../components/homepage/AppSidebar";
import { NotificationsDropdown } from "../components/Event/NotificationsDropdown";
import { EventList } from "../components/Event/EventList";
import { useVendorCheck } from "../components/SecurityMonitor";
import MakeVendorButton from "./test";
import {
  analyticsData,
  notifications,
  sampleEvents,
} from "../components/Event/data";
import {
  animationStyles,
  useScrollAnimation,
} from "../components/Event/animations";
import { eventAPI } from "../utils/api";
import "../styles/mobile-enhancements.css";

// Main Event Management Component - ONLY for listing events
export default function EventManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { isVendor } = useVendorCheck();

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Only list-related state
  const [events, setEvents] = useState(sampleEvents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log("EventManagement render:", {
    pathname: location.pathname,
    search: location.search,
    userRole: user?.role,
    isVendor,
    eventsCount: events.length,
  });

  const fetchEvents = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await eventAPI.getEvents();
    setEvents(data);
  } catch (err) {
    console.error("🔴 Error fetching events:", err);

    // Check if it's unauthorized
    if (err.message.includes("401") || err.message.includes("Unauthorized")) {
      console.warn("👮 You were logged out due to unauthorized access");
    }

    setError(err.message);
    setEvents(sampleEvents);
  } finally {
    setLoading(false);
  } fetchEvents();
};


  // Add scroll animation effect
  useEffect(() => {
    const cleanup = useScrollAnimation();
    return cleanup;
  }, []);

  // Hide header and footer
  useEffect(() => {
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");

    if (header) header.style.display = "none";
    if (footer) footer.style.display = "none";

    return () => {
      if (header) header.style.display = "block";
      if (footer) footer.style.display = "block";
    };
  }, []);

  const handleViewEvent = (event) => {
    navigate(`/events/${event.id}`);
  };

  const handleCreateEvent = () => {
    if (!isVendor) {
      console.warn("Non-vendor user attempted to create event");
      return;
    }
    navigate("/events/create");
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        setLoading(true);
        await eventAPI.deleteEvent(eventId);
        setEvents(events.filter((event) => event.id !== eventId));
      } catch (err) {
        console.error("Error deleting event:", err);
        setError(err.message);
        // Fallback to local delete
        setEvents(events.filter((event) => event.id !== eventId));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-['Plus_Jakarta_Sans']">
      <style>{animationStyles}</style>

      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />

      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <MakeVendorButton />

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
                <h1 className="text-xl font-bold text-gray-900">
                  Event Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Manage your events and analytics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NotificationsDropdown notifications={notifications} />
              {isVendor && (
                <button
                  onClick={handleCreateEvent}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Create Event
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-xs">!</span>
                </div>
                <p className="text-red-800 font-medium">Error</p>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}

          <EventList
            events={events}
            onViewEvent={handleViewEvent}
            onDeleteEvent={handleDeleteEvent}
            analyticsData={analyticsData}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
