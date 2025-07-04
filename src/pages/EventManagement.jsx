"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import {
  SidebarProvider,
  useSidebar,
} from "../components/Event/SidebarProvider";
import { AppSidebar } from "../components/Event/AppSidebar";
import { NotificationsDropdown } from "../components/Event/NotificationsDropdown";
import { EventList } from "../components/Event/EventList";
import { EventForm } from "../components/Event/EventForm";
import { EventInformation } from "../components/Event/EventInformation";
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
  const [currentView, setCurrentView] = useState("list");
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e, fieldName) => {
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
  };

  const handleCreateEvent = () => {
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

  const handleSaveEvent = async () => {
    try {
      setLoading(true);
      setError(null);

      if (currentView === "create") {
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
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentView("list");
    resetForm();
    setEditingEvent(null);
    setViewingEvent(null);
  };

  const handleNavigation = (view) => {
    if (view === "create") {
      handleCreateEvent();
    } else {
      setCurrentView(view);
    }
  };

  // Event List View Main Content Component
  const EventListContent = () => {
    const { isCollapsed, toggleSidebar } = useSidebar();

    return (
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={toggleSidebar}
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
            onCreateEvent={handleCreateEvent}
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
      <SidebarProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-['Plus_Jakarta_Sans']">
          <style jsx>{animationStyles}</style>

          <AppSidebar onNavigate={setCurrentView} currentView={currentView} />

          <EventListContent />
        </div>
      </SidebarProvider>
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

  // Create/Edit Event Form Content Component
  const EventFormContent = () => {
    const { isCollapsed, toggleSidebar } = useSidebar();

    return (
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={toggleSidebar}
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
    );
  };

  // Create/Edit Event Form View
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-['Plus_Jakarta_Sans']">
        <style jsx>{animationStyles}</style>

        <AppSidebar onNavigate={setCurrentView} currentView={currentView} />

        <EventFormContent />
      </div>
    </SidebarProvider>
  );
}
