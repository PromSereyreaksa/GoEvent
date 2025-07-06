"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, RefreshCw } from "lucide-react";
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
import { normalizeEventsArray } from "../utils/eventHelpers";
import "../styles/mobile-enhancements.css";

// Main Event Management Component - ONLY for listing events
export default function EventManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { is_vendor } = useVendorCheck();

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Only list-related state
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  console.log("EventManagement render:", {
    pathname: location.pathname,
    search: location.search,
    userRole: user?.role,
    is_vendor,
    eventsCount: events.length,
  });

  const fetchEvents = async (isRefresh = false, customFilters = {}) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Merge current filters with custom filters
      const apiFilters = { ...filters, ...customFilters };

      // Add search term if provided
      if (searchTerm.trim()) {
        apiFilters.search = searchTerm.trim();
      }

      // Don't use cache if refreshing
      const data = await eventAPI.getEvents(apiFilters, !isRefresh);

      // Normalize the events data to ensure consistency
      const normalizedEvents = normalizeEventsArray(data);
      setEvents(normalizedEvents);

      if (isRefresh) {
        console.log("✅ Events refreshed successfully");
      }
    } catch (err) {
      console.error("🔴 Error fetching events:", err);

      // Check if it's unauthorized
      if (err.message.includes("Unauthorized")) {
        console.warn("👮 You were logged out due to unauthorized access");
        // Optionally redirect to login
        // navigate('/sign-in');
      }

      setError(err.message);
      // Fallback to sample events only if no events were loaded previously
      if (events.length === 0) {
        setEvents(sampleEvents);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

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

  // Cleanup cache on unmount
  useEffect(() => {
    return () => {
      // Clear event cache when component unmounts
      eventAPI.clearEventCache();
    };
  }, []);

  const handleViewEvent = (event) => {
    navigate(`/events/${event.id}`);
  };

  const handleCreateEvent = () => {
    if (!is_vendor) {
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
        console.log("✅ Event deleted successfully");
      } catch (err) {
        console.error("🔴 Error deleting event:", err);
        setError(err.message);

        // If API call fails, still try to remove from local state
        // This provides better UX while showing the error
        if (err.message.includes("Failed to delete")) {
          setEvents(events.filter((event) => event.id !== eventId));
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRefresh = () => {
    fetchEvents(true);
  };

  const handleUpdateEvent = async (eventId, updatedData) => {
    try {
      setLoading(true);
      const updatedEvent = await eventAPI.updateEvent(eventId, updatedData);
      setEvents(
        events.map((event) => (event.id === eventId ? updatedEvent : event))
      );
      console.log("✅ Event updated successfully");
    } catch (err) {
      console.error("🔴 Error updating event:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchEvents(false, { search: term });
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchEvents(false, newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm("");
    fetchEvents(false, {});
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
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh events"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <NotificationsDropdown notifications={notifications} />
              {is_vendor && (
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-xs">!</span>
                  </div>
                  <p className="text-red-800 font-medium">Error</p>
                </div>
                <button
                  onClick={() => {
                    setError(null);
                    fetchEvents();
                  }}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Retry
                </button>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}

          <EventList
            events={events}
            onViewEvent={handleViewEvent}
            onDeleteEvent={handleDeleteEvent}
            onUpdateEvent={handleUpdateEvent}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            analyticsData={analyticsData}
            loading={loading}
            refreshing={refreshing}
            searchTerm={searchTerm}
            filters={filters}
          />
        </div>
      </div>
    </div>
  );
}
