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

// Main Event Management Component
export default function EventManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { isVendor, requireVendor } = useVendorCheck();
  const searchParams = new URLSearchParams(location.search);
  const isCreateMode = searchParams.get("create") === "true";

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

  const [currentView, setCurrentView] = useState(
    isCreateMode ? "create" : "list"
  );
  const [events, setEvents] = useState(sampleEvents);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
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

  // Handle create mode initialization
  useEffect(() => {
    if (isCreateMode && currentView === "create") {
      handleCreateEvent();
    }
  }, [isCreateMode]);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await eventAPI.getEvents();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message);
        // Fall back to sample events if API fails
        setEvents(sampleEvents);
      } finally {
        setLoading(false);
      }
    };

    // Uncomment the line below to enable API integration
    // fetchEvents();
  }, []);

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
    // Only allow vendors to create events
    if (user?.role !== "vendor") {
      console.warn("Non-vendor user attempted to create event");
      return;
    }

    setCurrentView("create");
    resetForm();
    // Initialize with exactly 2 hosts (bride and groom) and one agenda day
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
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setFormData(event);
    setCurrentView("edit");
  };

  const handleViewEvent = (event) => {
    setViewingEvent(event);
    setCurrentView("view");
  };

  const handleDeleteEvent = async (eventId) => {
    console.log("Deleting event with ID:", eventId);
    console.log("Current events:", events);

    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        setLoading(true);
        setError(null);

        // Delete event via API
        await eventAPI.deleteEvent(eventId);

        const updatedEvents = events.filter((event) => {
          console.log("Checking event:", event.id, "against:", eventId);
          return event.id !== eventId;
        });

        console.log("Updated events:", updatedEvents);
        setEvents(updatedEvents);
      } catch (err) {
        console.error("Error deleting event:", err);
        setError(err.message);

        // Fallback to local state update if API fails
        const updatedEvents = events.filter((event) => {
          console.log("Checking event:", event.id, "against:", eventId);
          return event.id !== eventId;
        });

        console.log("Updated events:", updatedEvents);
        setEvents(updatedEvents);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveEvent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (currentView === "create") {
        // Double-check vendor privileges for create operations
        if (user?.role !== "vendor") {
          setError(
            "You don't have permission to create events. Vendor privileges required."
          );
          return;
        }

        // Create new event via API
        const newEvent = await eventAPI.createEvent(formData);
        setEvents([...events, newEvent]);
      } else if (currentView === "edit") {
        // Update existing event via API
        const updatedEvent = await eventAPI.updateEvent(
          editingEvent.id,
          formData
        );
        setEvents(
          events.map((event) =>
            event.id === editingEvent.id ? updatedEvent : event
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
    } catch (err) {
      console.error("Error saving event:", err);
      setError(err.message);

      // Fallback to local state update if API fails
      if (currentView === "create") {
        const newEvent = {
          ...formData,
          id: Date.now(),
        };
        setEvents([...events, newEvent]);
      } else if (currentView === "edit") {
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
        <MakeVendorButton/>
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

          <EventList
            events={events}
            onViewEvent={handleViewEvent}
            analyticsData={analyticsData}
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

  // Create/Edit Event Form View
  if (currentView === "create" || currentView === "edit") {
    // Additional check for create mode - non-vendors shouldn't reach here, but just in case
    if (currentView === "create" && user?.role !== "vendor") {
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
                <NotificationsDropdown notifications={notifications} />
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
