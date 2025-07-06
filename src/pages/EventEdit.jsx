"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, AlertCircle } from "lucide-react";
import AppSidebar from "../components/homepage/AppSidebar";
import { NotificationsDropdown } from "../components/Event/NotificationsDropdown";
import { EventForm } from "../components/Event/EventForm";
import { useVendorCheck } from "../components/SecurityMonitor";
import { notifications, sampleEvents } from "../components/Event/data";
import { animationStyles } from "../components/Event/animations";
import { eventAPI } from "../utils/api";

export default function EventEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { is_vendor } = useVendorCheck();

  // Redirect non-vendors immediately
  if (!is_vendor) {
    navigate("/events", { replace: true });
    return null;
  }

  // Component state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [originalEvent, setOriginalEvent] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    eventType: "",
    customEventType: "",
    name: "",
    details: "",
    agenda: [
      {
        id: Date.now(),
        date: "",
        title: "",
        activities: [{ id: Date.now() + 1, time: "", activity: "" }],
      },
    ],
    venue: "",
    hosts: [
      { id: Date.now(), name: "", parentNames: [""] },
      { id: Date.now() + 1, name: "", parentNames: [""] },
    ],
    date: "",
    startTime: "",
    endTime: "",
    youtubeUrl: "",
    googleMapLink: "",
    image: "",
  });

  console.log("EventEdit render:", {
    eventId: id,
    loading,
    saving,
    hasOriginalEvent: !!originalEvent,
    formDataName: formData.name,
  });

  // Fetch the event to edit
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to find in sample events first
        const sampleEvent = sampleEvents.find((e) => e.id === parseInt(id));
        if (sampleEvent) {
          setOriginalEvent(sampleEvent);
          populateFormData(sampleEvent);
        } else {
          // If not found in samples, try API
          const eventData = await eventAPI.getEvent(id);
          setOriginalEvent(eventData);
          populateFormData(eventData);
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(`Failed to load event: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    } else {
      setError("No event ID provided");
      setLoading(false);
    }
  }, [id]);

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

  // Populate form data from event
  const populateFormData = (event) => {
    setFormData({
      eventType: event.eventType || "",
      customEventType: event.customEventType || "",
      name: event.name || "",
      details: event.details || "",
      agenda:
        event.agenda && event.agenda.length > 0
          ? event.agenda
          : [
              {
                id: Date.now(),
                date: event.date || "",
                title: "",
                activities: [
                  {
                    id: Date.now() + 1,
                    time: event.startTime || "",
                    activity: "",
                  },
                ],
              },
            ],
      venue: event.venue || "",
      hosts:
        event.hosts && event.hosts.length > 0
          ? event.hosts
          : [
              { id: Date.now(), name: "", parentNames: [""] },
              { id: Date.now() + 1, name: "", parentNames: [""] },
            ],
      date: event.date || "",
      startTime: event.startTime || "",
      endTime: event.endTime || "",
      youtubeUrl: event.youtubeUrl || "",
      googleMapLink: event.googleMapLink || "",
      image: event.image || "",
    });
  };

  // Handle form input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Handle file uploads
  const handleFileUpload = useCallback((e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image file size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: event.target.result,
        }));
      };
      reader.onerror = () => {
        setError("Failed to read image file");
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Handle agenda changes
  const handleAgendaChange = useCallback((agendaIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      agenda: prev.agenda.map((day, index) =>
        index === agendaIndex ? { ...day, [field]: value } : day
      ),
    }));
  }, []);

  // Handle activity changes
  const handleActivityChange = useCallback(
    (agendaIndex, activityIndex, field, value) => {
      setFormData((prev) => ({
        ...prev,
        agenda: prev.agenda.map((day, dayIndex) =>
          dayIndex === agendaIndex
            ? {
                ...day,
                activities: day.activities.map((activity, actIndex) =>
                  actIndex === activityIndex
                    ? { ...activity, [field]: value }
                    : activity
                ),
              }
            : day
        ),
      }));
    },
    []
  );

  // Handle host changes
  const handleHostChange = useCallback((hostIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      hosts: prev.hosts.map((host, index) =>
        index === hostIndex ? { ...host, [field]: value } : host
      ),
    }));
  }, []);

  // Handle parent name changes
  const handleParentNameChange = useCallback(
    (hostIndex, parentIndex, value) => {
      setFormData((prev) => ({
        ...prev,
        hosts: prev.hosts.map((host, hIndex) =>
          hIndex === hostIndex
            ? {
                ...host,
                parentNames: host.parentNames.map((name, pIndex) =>
                  pIndex === parentIndex ? value : name
                ),
              }
            : host
        ),
      }));
    },
    []
  );

  // Add new agenda day
  const addAgendaDay = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      agenda: [
        ...prev.agenda,
        {
          id: Date.now(),
          date: "",
          title: "",
          activities: [{ id: Date.now() + 1, time: "", activity: "" }],
        },
      ],
    }));
  }, []);

  // Remove agenda day
  const removeAgendaDay = useCallback((agendaIndex) => {
    setFormData((prev) => ({
      ...prev,
      agenda: prev.agenda.filter((_, index) => index !== agendaIndex),
    }));
  }, []);

  // Add new activity
  const addActivity = useCallback((agendaIndex) => {
    setFormData((prev) => ({
      ...prev,
      agenda: prev.agenda.map((day, index) =>
        index === agendaIndex
          ? {
              ...day,
              activities: [
                ...day.activities,
                { id: Date.now(), time: "", activity: "" },
              ],
            }
          : day
      ),
    }));
  }, []);

  // Remove activity
  const removeActivity = useCallback((agendaIndex, activityIndex) => {
    setFormData((prev) => ({
      ...prev,
      agenda: prev.agenda.map((day, dayIndex) =>
        dayIndex === agendaIndex
          ? {
              ...day,
              activities: day.activities.filter(
                (_, actIndex) => actIndex !== activityIndex
              ),
            }
          : day
      ),
    }));
  }, []);

  // Add new host
  const addHost = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      hosts: [...prev.hosts, { id: Date.now(), name: "", parentNames: [""] }],
    }));
  }, []);

  // Remove host
  const removeHost = useCallback((hostIndex) => {
    setFormData((prev) => ({
      ...prev,
      hosts: prev.hosts.filter((_, index) => index !== hostIndex),
    }));
  }, []);

  // Add parent name
  const addParentName = useCallback((hostIndex) => {
    setFormData((prev) => ({
      ...prev,
      hosts: prev.hosts.map((host, index) =>
        index === hostIndex
          ? { ...host, parentNames: [...host.parentNames, ""] }
          : host
      ),
    }));
  }, []);

  // Remove parent name
  const removeParentName = useCallback((hostIndex, parentIndex) => {
    setFormData((prev) => ({
      ...prev,
      hosts: prev.hosts.map((host, hIndex) =>
        hIndex === hostIndex
          ? {
              ...host,
              parentNames: host.parentNames.filter(
                (_, pIndex) => pIndex !== parentIndex
              ),
            }
          : host
      ),
    }));
  }, []);

  // Validate form data
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Event name is required");
      return false;
    }
    if (!formData.date) {
      setError("Event date is required");
      return false;
    }
    if (!formData.eventType) {
      setError("Event type is required");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Prepare data for API
      const updateData = {
        ...formData,
        id: parseInt(id),
        // Filter out empty values
        agenda: formData.agenda.filter(
          (day) =>
            day.date ||
            day.title ||
            day.activities.some((act) => act.time || act.activity)
        ),
        hosts: formData.hosts.filter(
          (host) => host.name || host.parentNames.some((name) => name.trim())
        ),
      };

      console.log("Updating event with data:", updateData);

      await eventAPI.updateEvent(id, updateData);
      navigate("/events", { replace: true });
    } catch (err) {
      console.error("Error updating event:", err);
      setError(`Failed to update event: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    const hasChanges =
      JSON.stringify(formData) !== JSON.stringify(originalEvent);
    if (hasChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to cancel?"
        )
      ) {
        navigate("/events", { replace: true });
      }
    } else {
      navigate("/events", { replace: true });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-['Plus_Jakarta_Sans'] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !originalEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-['Plus_Jakarta_Sans'] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Failed to Load Event
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/events")}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Events
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                <h1 className="text-xl font-bold text-gray-900">Edit Event</h1>
                <p className="text-sm text-gray-600">
                  {originalEvent?.name
                    ? `Editing: ${originalEvent.name}`
                    : "Update event details"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NotificationsDropdown notifications={notifications} />
              <div className="text-sm text-gray-500">
                {saving ? "Saving..." : ""}
              </div>
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

          {/* Enhanced EventForm for editing */}
          <EventForm
            formData={formData}
            onInputChange={handleInputChange}
            onFileUpload={handleFileUpload}
            onSave={handleSave}
            onCancel={handleCancel}
            isEdit={true}
            loading={saving}
            error={error}
            // Extended props for complex form handling
            onAgendaChange={handleAgendaChange}
            onActivityChange={handleActivityChange}
            onHostChange={handleHostChange}
            onParentNameChange={handleParentNameChange}
            addAgendaDay={addAgendaDay}
            removeAgendaDay={removeAgendaDay}
            addActivity={addActivity}
            removeActivity={removeActivity}
            addHost={addHost}
            removeHost={removeHost}
            addParentName={addParentName}
            removeParentName={removeParentName}
          />
        </div>
      </div>
    </div>
  );
}
