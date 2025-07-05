"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, Lock, AlertTriangle } from "lucide-react";
import AppSidebar from "../components/homepage/AppSidebar";
import { NotificationsDropdown } from "../components/Event/NotificationsDropdown";
import { EventList } from "../components/Event/EventList";
import { EventForm } from "../components/Event/EventForm";
import { useVendorCheck } from "../components/SecurityMonitor";
import { EventInformation } from "../components/Event/EventInformation";
import { eventAPI } from "../utils/api";
import UserRoleDebug from "../components/UserRoleDebug";
import {
  animationStyles,
  useScrollAnimation,
} from "../components/Event/animations";
import "../styles/mobile-enhancements.css";

// Main Event Management Component
export default function EventManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { isVendor, requireVendor } = useVendorCheck();
  const searchParams = new URLSearchParams(location.search);
  const isCreateMode = searchParams.get("create") === "true";

  // Debug logging for user role and vendor status
  useEffect(() => {
    console.log("EventManagement - User Debug Info:", {
      user,
      userRole: user?.role,
      isVendor,
      isCreateMode,
      userObject: JSON.stringify(user, null, 2),
    });
  }, [user, isVendor, isCreateMode]);

  // Immediate redirect for non-vendors in create mode - no useEffect delay
  if (isCreateMode && !isVendor) {
    console.warn("EventManagement: Non-vendor user blocked from create mode", {
      userRole: user?.role,
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
    // Immediate redirect to homepage
    navigate("/homepage", { replace: true });
    return null; // Don't render anything while redirecting
  }

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [currentView, setCurrentView] = useState("list");
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    title: "",
    date: "",
    start_Time: "",
    // customEventType: "",
    // details: "",
    // agenda: [],
    // venue: "",
    // hosts: [],
    // endTime: "",
    // youtubeUrl: "",
    // googleMapLink: "",
    // image: "",
  });

  // Handle URL parameter changes for create mode
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const isCreateMode = searchParams.get("create") === "true";

    if (isCreateMode && isVendor) {
      setCurrentView("create");
      // Initialize form data for create mode
      resetForm();
      setFormData((prev) => ({
        ...prev,
        hosts: [
          { id: Date.now(), name: "", parentNames: [""] },
          { id: Date.now() + 1, name: "", parentNames: [""] },
        ],
        agenda: [
          {
            id: Date.now() + 2,
            date: "",
            title: "",
            activities: [{ id: Date.now() + 3, time: "", activity: "" }],
          },
        ],
      }));
    } else if (isCreateMode && !isVendor) {
      // Non-vendor tried to access create mode, redirect to list
      navigate("/events", { replace: true });
    } else if (!isCreateMode && currentView === "create") {
      // User navigated away from create mode
      setCurrentView("list");
    }
  }, [location.search, isVendor, navigate, currentView]);

  // Handle create mode initialization
  useEffect(() => {
    if (isCreateMode && currentView === "create") {
      // Only allow vendors to create events - check both role and is_vendor flag
      if (user?.is_vendor !== true) {
        console.warn("Non-vendor user attempted to create event");
        navigate("/homepage", { replace: true });
        return;
      }

      // Initialize form data for create mode
      resetForm();
      setFormData((prev) => ({
        ...prev,
        hosts: [
          { id: Date.now(), name: "", parentNames: [""] },
          { id: Date.now() + 1, name: "", parentNames: [""] },
        ],
        agenda: [
          {
            id: Date.now() + 2,
            date: "",
            title: "",
            activities: [{ id: Date.now() + 3, time: "", activity: "" }],
          },
        ],
      }));
    }
  }, [isCreateMode, currentView, user?.role, user?.is_vendor, navigate]);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log("🔄 Starting event fetch from API...");
        setLoading(true);
        setError(null);
        const data = await eventAPI.getEvents();
        console.log("✅ Events fetched from API successfully:", data);
        console.log(
          "📊 Raw API response type:",
          typeof data,
          "Is array:",
          Array.isArray(data)
        );

        // Ensure we have an array of events
        let eventsArray = [];
        if (Array.isArray(data)) {
          eventsArray = data;
          console.log("📋 Using direct array format, length:", data.length);
        } else if (data && typeof data === "object") {
          // Handle different API response formats
          if (data.results && Array.isArray(data.results)) {
            // Paginated response format
            eventsArray = data.results;
            console.log(
              "📄 Using paginated format (data.results), length:",
              data.results.length
            );
          } else if (data.events && Array.isArray(data.events)) {
            // Nested events array
            eventsArray = data.events;
            console.log(
              "📁 Using nested format (data.events), length:",
              data.events.length
            );
          } else if (data.data && Array.isArray(data.data)) {
            // Data wrapper format
            eventsArray = data.data;
            console.log(
              "📦 Using wrapper format (data.data), length:",
              data.data.length
            );
          } else {
            // Single event object, wrap in array
            eventsArray = [data];
            console.log("📄 Wrapping single event object in array");
          }
        } else {
          console.log("⚠️ Unexpected data format, setting empty array");
        }

        // Map API fields to frontend structure if needed
        const normalizedEvents = eventsArray.map((event, index) => {
          console.log(`🔧 Normalizing event ${index + 1}:`, event);
          return {
            ...event,
            // Ensure consistent field names
            id: event.id || event._id,
            eventType:
              event.eventType || event.event_type || event.type || "wedding",
            name: event.name || event.title || event.event_name || "",
            date: event.date || event.event_date || "",
            startTime:
              event.startTime || event.start_time || event.start_Time || "",
            endTime: event.endTime || event.end_time || event.end_Time || "",
            venue: event.venue || event.location || "",
            details: event.details || event.description || "",
            image: event.image || event.image_url || event.photo || "",
            youtubeUrl: event.youtubeUrl || event.youtube_url || "",
            googleMapLink:
              event.googleMapLink ||
              event.google_map_link ||
              event.map_link ||
              "",
            hosts: event.hosts || [],
            agenda: event.agenda || [],
          };
        });

        console.log("🎉 Final normalized events:", normalizedEvents);
        setEvents(normalizedEvents);
      } catch (err) {
        console.error("❌ Error fetching events:", err);
        console.error("🔍 Error details:", {
          message: err.message,
          stack: err.stack,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(err.message);
        // Start with empty events array if API fails
        setEvents([]);
      } finally {
        setLoading(false);
        console.log("✅ Event fetch process completed");
      }
    };

    // Enable API integration
    fetchEvents();
  }, []); // Empty dependency array - only run once on mount

  // Add scroll animation effect
  useEffect(() => {
    const cleanup = useScrollAnimation();
    return cleanup;
  }, [currentView]);

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

  // Hide footer
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (footer) {
      footer.style.display = "none";
    }

    return () => {
      if (footer) {
        footer.style.display = "block";
      }
    };
  }, []);

  const resetForm = () => {
    setFormData({
      eventType: "",
      customEventType: "",
      name: "",
      details: "",
      agenda: [], // Changed to array for multi-day agenda
      venue: "",
      hosts: [],
      date: "",
      startTime: "",
      endTime: "",
      youtubeUrl: "",
      googleMapLink: "",
      image: "",
    });
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleFileUpload = useCallback((e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleCreateEvent = () => {
    // Debug logging for create event access
    console.log("handleCreateEvent - Access Check:", {
      userRole: user?.role,
      userIsVendor: user?.is_vendor,
      isVendor,
      hasVendorAccess: user?.role === "vendor" || user?.is_vendor === true,
      userObject: user,
    });

    // Only allow vendors to create events - check both role and is_vendor flag
    if (user?.role !== "vendor" && user?.is_vendor !== true) {
      console.warn("Non-vendor user attempted to create event", {
        userRole: user?.role,
        userIsVendor: user?.is_vendor,
        userId: user?.id,
        isVendor,
        user: user,
      });
      return;
    }

    // Navigate to create mode URL
    navigate("/events?create=true");
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setFormData(event);
    setCurrentView("edit");
  };

  const handleViewEvent = (event) => {
    console.log("handleViewEvent called with:", event);
    setViewingEvent(event);
    setCurrentView("view");
    console.log("Current view set to:", "view");
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        console.log("🗑️ Starting delete event operation for ID:", eventId);
        setLoading(true);
        setError(null);

        // Delete event via API
        await eventAPI.deleteEvent(eventId);
        console.log("✅ Event deleted successfully from API");

        const updatedEvents = events.filter((event) => event.id !== eventId);
        setEvents(updatedEvents);
        console.log(
          "🔄 Event removed from local state, remaining events:",
          updatedEvents.length
        );
      } catch (err) {
        console.error("❌ Error deleting event:", err);
        console.error("🔍 Delete error details:", {
          message: err.message,
          stack: err.stack,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(err.message);

        // Fallback to local state update if API fails
        console.log("🔄 Attempting fallback to local state update...");
        const updatedEvents = events.filter((event) => event.id !== eventId);
        setEvents(updatedEvents);
        console.log("📝 Event removed from local state (fallback)");
      } finally {
        setLoading(false);
        console.log("✅ Delete event operation completed");
      }
    }
  };

  const handleSaveEvent = useCallback(async () => {
    try {
      console.log("💾 Starting save event operation...");
      setLoading(true);
      setError(null);

      if (currentView === "create") {
        console.log("➕ Creating new event with data:", formData);
        // Double-check vendor privileges for create operations - check both role and is_vendor flag
        if (user?.role !== "vendor" && user?.is_vendor !== true) {
          console.error("❌ Access denied: User is not a vendor");
          setError(
            "You don't have permission to create events. Vendor privileges required."
          );
          return;
        }

        // Create new event via API
        const newEvent = await eventAPI.createEvent(formData);
        console.log("✅ Event created successfully:", newEvent);
        setEvents([...events, newEvent]);
      } else if (currentView === "edit") {
        console.log(
          "✏️ Updating event:",
          editingEvent.id,
          "with data:",
          formData
        );
        // Update existing event via API
        const updatedEvent = await eventAPI.updateEvent(
          editingEvent.id,
          formData
        );
        console.log("✅ Event updated successfully:", updatedEvent);
        setEvents(
          events.map((event) =>
            event.id === editingEvent.id ? updatedEvent : event
          )
        );
      }

      console.log("🔄 Redirecting to list view...");
      setCurrentView("list");
      resetForm();
      setEditingEvent(null);
      setViewingEvent(null);

      // Update URL to remove create parameter
      if (isCreateMode) {
        navigate("/events", { replace: true });
      }
    } catch (err) {
      console.error("❌ Error saving event:", err);
      console.error("🔍 Save error details:", {
        message: err.message,
        stack: err.stack,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(err.message);

      // Fallback to local state update if API fails
      console.log("🔄 Attempting fallback to local state update...");
      if (currentView === "create") {
        const newEvent = {
          ...formData,
          id: Date.now(),
        };
        console.log("📝 Adding event to local state:", newEvent);
        setEvents([...events, newEvent]);
      } else if (currentView === "edit") {
        console.log("📝 Updating event in local state");
        setEvents(
          events.map((event) =>
            event.id === editingEvent.id
              ? { ...formData, id: editingEvent.id }
              : event
          )
        );
      }

      setCurrentView("list");
      resetForm();
      setEditingEvent(null);
      setViewingEvent(null);

      // Update URL to remove create parameter
      if (isCreateMode) {
        navigate("/events", { replace: true });
      }
    } finally {
      setLoading(false);
      console.log("✅ Save event operation completed");
    }
  }, [
    currentView,
    user?.role,
    formData,
    events,
    editingEvent,
    isCreateMode,
    navigate,
  ]);

  const handleCancel = useCallback(() => {
    setCurrentView("list");
    resetForm();
    setEditingEvent(null);
    setViewingEvent(null);

    // Update URL to remove create parameter
    if (isCreateMode) {
      navigate("/events", { replace: true });
    }
  }, [isCreateMode, navigate]);

  const handleNavigation = (view) => {
    if (view === "create") {
      handleCreateEvent();
    } else {
      setCurrentView(view);
    }
  };

  // Event List View Main Content Component
  const EventListContent = () => {
    return (
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
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
              <NotificationsDropdown notifications={[]} />
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Display */}
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

          {/* Loading Display */}
          {loading && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-blue-800 font-medium">Loading Events...</p>
              </div>
              <p className="text-blue-600 text-sm mt-1">
                Fetching events from the API
              </p>
            </div>
          )}

          {/* Success Message - Show when events loaded successfully */}
          {!loading && !error && events.length > 0 && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <p className="text-green-800 font-medium">
                  Events Loaded Successfully
                </p>
              </div>
              <p className="text-green-600 text-sm mt-1">
                Found {events.length} event{events.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          {/* No Events Message - Show when API succeeds but returns no events */}
          {!loading && !error && events.length === 0 && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-xs">i</span>
                </div>
                <p className="text-yellow-800 font-medium">No Events Found</p>
              </div>
              <p className="text-yellow-600 text-sm mt-1">
                API fetch successful, but no events returned
              </p>
            </div>
          )}

          {/* Debug Info */}
          <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
            <h3 className="font-semibold text-gray-800 mb-2">Debug Info:</h3>
            <p className="text-sm text-gray-600">
              Events array length: {events.length}
            </p>
            <p className="text-sm text-gray-600">
              Events data: {JSON.stringify(events.slice(0, 2), null, 2)}
            </p>
            <p className="text-sm text-gray-600">
              Loading: {loading ? "true" : "false"}
            </p>
          </div>

          <EventList
            events={events}
            onViewEvent={handleViewEvent}
            analyticsData={[]}
            loading={loading}
          />
        </div>
      </div>
    );
  };

  // Event List View
  if (currentView === "list") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-['Plus_Jakarta_Sans']">
        <style jsx>{animationStyles}</style>
        <UserRoleDebug />

        <AppSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />

        <EventListContent />
      </div>
    );
  }

  // Event Information View
  if (currentView === "view") {
    console.log("Rendering view with viewingEvent:", viewingEvent);

    if (!viewingEvent) {
      console.log("No viewingEvent found, redirecting to list");
      setCurrentView("list");
      return null;
    }

    return (
      <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans'] overflow-hidden smooth-scroll">
        <style jsx>{animationStyles}</style>
        <EventInformation
          event={viewingEvent}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onBack={() => setCurrentView("list")}
        />
      </div>
    );
  }

  // Create/Edit Event Form Content Component
  const EventFormContent = () => {
    return (
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
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
                  {currentView === "create" ? "Create Event" : "Edit Event"}
                </h1>
                <p className="text-sm text-gray-600">
                  {currentView === "create"
                    ? "Fill in the details to create a new event"
                    : "Update your event information"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NotificationsDropdown notifications={[]} />
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Display */}
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

          <EventForm
            formData={formData}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onSave={handleSaveEvent}
            onCancel={handleCancel}
            isEdit={currentView === "edit"}
          />
        </div>
      </div>
    );
  };

  // Create/Edit Event Form View
  if (currentView === "create" || currentView === "edit") {
    // Additional check for create mode - non-vendors shouldn't reach here, but just in case
    if (
      currentView === "create" &&
      user?.role !== "vendor" &&
      user?.is_vendor !== true
    ) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-['Plus_Jakarta_Sans'] flex items-center justify-center">
          <div className="max-w-md w-full mx-auto text-center p-8">
            <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-red-600" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Access Denied
              </h1>

              <p className="text-gray-600 mb-6 leading-relaxed">
                You need vendor privileges to create events.
              </p>

              <button
                onClick={() => navigate("/events")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                Back to Events
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-['Plus_Jakarta_Sans']">
        <style jsx>{animationStyles}</style>

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
                    {currentView === "create" ? "Create Event" : "Edit Event"}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {currentView === "create"
                      ? "Fill in the details to create a new event"
                      : "Update your event information"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <NotificationsDropdown notifications={[]} />
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Error Display */}
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

            {/* Loading Display for Save Operations */}
            {loading && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-blue-800 font-medium">
                    {currentView === "create"
                      ? "Creating Event..."
                      : "Updating Event..."}
                  </p>
                </div>
                <p className="text-blue-600 text-sm mt-1">
                  {currentView === "create"
                    ? "Saving new event to the API"
                    : "Updating event via API"}
                </p>
              </div>
            )}

            <EventForm
              formData={formData}
              onInputChange={handleInputChange}
              onFileUpload={handleFileUpload}
              onSave={handleSaveEvent}
              onCancel={handleCancel}
              isEdit={currentView === "edit"}
            />
          </div>
        </div>
      </div>
    );
  }

  // Default fallback - redirect to list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-['Plus_Jakarta_Sans']">
      <style jsx>{animationStyles}</style>

      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />

      <EventListContent />
    </div>
  );
}
