"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  ArrowLeft,
  Youtube,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

export default function EventManagement() {
  const [currentView, setCurrentView] = useState("list"); // 'list', 'create', 'edit'
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Annual Company Retreat",
      venue: "Mountain View Resort",
      date: "2024-03-15",
      startTime: "09:00",
      endTime: "17:00",
      description:
        "Join us for our annual company retreat featuring team building activities, workshops, and networking opportunities.",
      location: "Mountain View Resort, 123 Resort Drive, Aspen, CO",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      image: "/placeholder.svg?height=200&width=400",
      mapImage: null,
    },
    {
      id: 2,
      name: "Product Launch Event",
      venue: "Tech Conference Center",
      date: "2024-04-20",
      startTime: "14:00",
      endTime: "18:00",
      description:
        "Exciting product launch event showcasing our latest innovations and future roadmap.",
      location:
        "Tech Conference Center, 456 Innovation Blvd, San Francisco, CA",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      image: "/placeholder.svg?height=200&width=400",
      mapImage: null,
    },
  ]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    venue: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    location: "",
    youtubeUrl: "",
    image: "",
    mapImage: "",
  });

  // Add scroll animation effect
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [currentView]); // Re-run when view changes

  const resetForm = () => {
    setFormData({
      name: "",
      venue: "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
      location: "",
      youtubeUrl: "",
      image: "",
      mapImage: "",
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
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setFormData(event);
    setCurrentView("edit");
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event.id !== eventId));
    }
  };

  const handleSaveEvent = () => {
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
  };

  const handleCancel = () => {
    setCurrentView("list");
    resetForm();
    setEditingEvent(null);
  };

  const getYouTubeVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Event List View
  if (currentView === "list") {
    return (
      <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans']">
        <style jsx>{`
          .animate-on-scroll {
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          .animate-on-scroll.animate-in {
            opacity: 1;
            transform: scale(1);
          }

          .animate-on-scroll.delay-100 {
            transition-delay: 0.1s;
          }

          .animate-on-scroll.delay-200 {
            transition-delay: 0.2s;
          }

          .animate-on-scroll.delay-300 {
            transition-delay: 0.3s;
          }

          .animate-on-scroll.delay-400 {
            transition-delay: 0.4s;
          }

          .animate-on-scroll.delay-500 {
            transition-delay: 0.5s;
          }

          .animate-on-scroll.delay-600 {
            transition-delay: 0.6s;
          }
        `}</style>

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-white pt-16 sm:pt-20 pb-32 sm:pb-40 lg:pb-48 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-1.svg')] bg-center bg-no-repeat bg-cover opacity-20 scale-110 sm:scale-100"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 lg:mt-20">
            <div className="text-center animate-on-scroll">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[110%] sm:leading-[115%] tracking-[-1px] sm:tracking-[-2px] text-white mb-4 sm:mb-6">
                Event Management
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-white max-w-2xl lg:max-w-3xl mx-auto px-4 animate-on-scroll delay-200">
                Create, manage, and organize your events with ease. From
                planning to execution, we've got you covered.
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-t from-white via-white/90 to-transparent z-20"></div>
        </section>

        {/* Main Content Section */}
        <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-12 animate-on-scroll">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[120%] tracking-[-1.5px] sm:tracking-[-2.5px] text-black mb-4">
                  Your Events
                </h2>
                <p className="text-lg text-neutral-600">
                  Manage all your events in one place
                </p>
              </div>
              <button
                onClick={handleCreateEvent}
                className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2 shadow-lg hover:shadow-xl animate-on-scroll delay-200 w-fit"
              >
                <Plus className="w-5 h-5" />
                Create Event
              </button>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className={`bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-on-scroll delay-${
                    200 + index * 100
                  }`}
                >
                  {/* Event Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200">
                    <img
                      src={
                        event.image || "/placeholder.svg?height=200&width=400"
                      }
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="p-2 bg-white/90 text-blue-600 hover:bg-white rounded-full transition-colors shadow-sm"
                        aria-label="Edit event"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 bg-white/90 text-red-600 hover:bg-white rounded-full transition-colors shadow-sm"
                        aria-label="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-black mb-4">
                      {event.name}
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-neutral-600">
                        <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-sm">{event.venue}</span>
                      </div>

                      <div className="flex items-center gap-3 text-neutral-600">
                        <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-sm">
                          {formatDate(event.date)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-neutral-600">
                        <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-sm">
                          {formatTime(event.startTime)} -{" "}
                          {formatTime(event.endTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {events.length === 0 && (
              <div className="text-center py-20 animate-on-scroll">
                <div className="bg-gray-50 rounded-3xl p-12 max-w-md mx-auto">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-black mb-2">
                    No Events Yet
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    Get started by creating your first event
                  </p>
                  <button
                    onClick={handleCreateEvent}
                    className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Create Your First Event
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  // Create/Edit Event Form View
  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans']">
      <style jsx>{`
        .animate-on-scroll {
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: scale(1);
        }

        .animate-on-scroll.delay-100 {
          transition-delay: 0.1s;
        }

        .animate-on-scroll.delay-200 {
          transition-delay: 0.2s;
        }

        .animate-on-scroll.delay-300 {
          transition-delay: 0.3s;
        }

        .animate-on-scroll.delay-400 {
          transition-delay: 0.4s;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-white pt-16 sm:pt-20 pb-32 sm:pb-40 lg:pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-1.svg')] bg-center bg-no-repeat bg-cover opacity-20 scale-110 sm:scale-100"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 lg:mt-20">
          <div className="text-center animate-on-scroll">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[110%] sm:leading-[115%] tracking-[-1px] sm:tracking-[-2px] text-white mb-4 sm:mb-6">
              {currentView === "create" ? "Create New Event" : "Edit Event"}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white max-w-2xl lg:max-w-3xl mx-auto px-4 animate-on-scroll delay-200">
              {currentView === "create"
                ? "Fill in the details below to create your amazing event and bring your vision to life."
                : "Update your event details to keep everything organized and up to date."}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-t from-white via-white/90 to-transparent z-20"></div>
      </section>

      {/* Form Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-12 animate-on-scroll">
            <button
              onClick={handleCancel}
              className="p-2 text-neutral-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back to events list"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[120%] tracking-[-1.5px] sm:tracking-[-2.5px] text-black mb-2">
                Event Details
              </h2>
              <p className="text-lg text-neutral-600">
                Fill in the information below to{" "}
                {currentView === "create" ? "create" : "update"} your event
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEvent();
            }}
            className="bg-gray-50 rounded-3xl p-8 md:p-12 animate-on-scroll delay-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Event Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-black font-semibold mb-3">
                  Event Image
                </label>
                <div className="relative">
                  {formData.image ? (
                    <div className="relative">
                      <img
                        src={formData.image || "/placeholder.svg"}
                        alt="Event preview"
                        className="w-full h-48 object-cover rounded-2xl border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, image: "" }))
                        }
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        Upload an event image
                      </p>
                      <label className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Choose Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "image")}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Name */}
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="block text-black font-semibold mb-3"
                >
                  Event Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter event name"
                  className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Venue Name */}
              <div className="md:col-span-2">
                <label
                  htmlFor="venue"
                  className="block text-black font-semibold mb-3"
                >
                  Venue Name *
                </label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  placeholder="Enter venue name"
                  className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="date"
                  className="block text-black font-semibold mb-3"
                >
                  Event Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Start Time */}
              <div>
                <label
                  htmlFor="startTime"
                  className="block text-black font-semibold mb-3"
                >
                  Start Time *
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* End Time */}
              <div>
                <label
                  htmlFor="endTime"
                  className="block text-black font-semibold mb-3"
                >
                  End Time *
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Location for Maps */}
              <div className="md:col-span-2">
                <label
                  htmlFor="location"
                  className="block text-black font-semibold mb-3"
                >
                  Full Address
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter full address for Google Maps"
                  className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Enter a complete address to show the location on the map
                </p>
              </div>

              {/* Embed Map URL */}
              <div className="md:col-span-2">
                <label
                  htmlFor="mapImage"
                  className="block text-black font-semibold mb-3"
                >
                  Embed Map URL (Optional)
                </label>
                <input
                  type="url"
                  id="mapImage"
                  name="mapImage"
                  value={formData.mapImage}
                  onChange={handleInputChange}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Get the embed URL from Google Maps: Share → Embed a map → Copy
                  HTML
                </p>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-black font-semibold mb-3"
                >
                  Event Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your event..."
                  rows="4"
                  className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* YouTube URL */}
              <div className="md:col-span-2">
                <label
                  htmlFor="youtubeUrl"
                  className="block text-black font-semibold mb-3"
                >
                  YouTube Video URL
                </label>
                <input
                  type="url"
                  id="youtubeUrl"
                  name="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={handleInputChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Previews */}
            <div className="mt-12 space-y-8">
              {/* Embedded Map Preview */}
              {formData.mapImage && (
                <div className="animate-on-scroll delay-300">
                  <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Embedded Map Preview
                  </h3>
                  <div className="bg-white rounded-2xl p-4 border border-gray-200">
                    <iframe
                      src={formData.mapImage}
                      width="100%"
                      height="300"
                      style={{ border: 0, borderRadius: "12px" }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Embedded Map"
                    />
                  </div>
                </div>
              )}

              {/* Google Maps Preview (only if no embedded map and location is provided) */}
              {formData.location && !formData.mapImage && (
                <div className="animate-on-scroll delay-300">
                  <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Location Preview
                  </h3>
                  <div className="bg-white rounded-2xl p-4 border border-gray-200">
                    <div className="bg-gray-100 rounded-xl p-8 text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Map Preview</p>
                      <p className="text-sm text-gray-500">
                        {formData.location}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Note: Add a Google Maps API key to display the actual
                        map
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* YouTube Preview */}
              {formData.youtubeUrl &&
                getYouTubeVideoId(formData.youtubeUrl) && (
                  <div className="animate-on-scroll delay-400">
                    <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
                      <Youtube className="w-5 h-5 text-red-600" />
                      Video Preview
                    </h3>
                    <div className="bg-white rounded-2xl p-4 border border-gray-200">
                      <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                          formData.youtubeUrl
                        )}`}
                        width="100%"
                        height="315"
                        style={{ border: 0, borderRadius: "12px" }}
                        allowFullScreen
                        title="Event Video Preview"
                      />
                    </div>
                  </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-gray-200">
              <button
                type="submit"
                disabled={
                  !formData.name ||
                  !formData.venue ||
                  !formData.date ||
                  !formData.startTime ||
                  !formData.endTime
                }
                className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {currentView === "create" ? "Create Event" : "Update Event"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 text-gray-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-300 transition-colors inline-flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}