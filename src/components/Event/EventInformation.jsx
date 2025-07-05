import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Edit3,
  Trash2,
  Play,
  Users,
  Heart,
  MoreVertical,
  X,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function EventInformation({ event, onEdit, onDelete, onBack }) {
  console.log("EventInformation rendered with event:", event);

  // Safety check - if no event, show error state
  if (!event) {
    return (
      <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans'] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The event you're looking for could not be loaded.
          </p>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Confirmation modal state
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    isAnimating: false,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteClick = () => {
    setConfirmationModal({
      isOpen: true,
      title: "Delete Event",
      message: `Are you sure you want to delete "${event.name}"? This action cannot be undone.`,
      isAnimating: true,
      onConfirm: () => {
        onDelete(event.id);
      },
    });
    setShowDropdown(false);
  };

  const closeConfirmation = () => {
    setConfirmationModal((prev) => ({ ...prev, isAnimating: false }));
    setTimeout(() => {
      setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
    }, 200);
  };

  const handleConfirm = () => {
    if (confirmationModal.onConfirm) {
      confirmationModal.onConfirm();
    }
    closeConfirmation();
  };

  const handleEditClick = () => {
    onEdit(event);
    setShowDropdown(false);
  };

  // Format date for agenda display
  const formatAgendaDate = (dateString) => {
    if (!dateString) return { day: "", month: "" };
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date
      .toLocaleDateString("en-US", { month: "short" })
      .toUpperCase();
    return { day, month };
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

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getEventTypeLabel = (eventType) => {
    const eventTypes = {
      wedding: "Wedding",
    };
    return eventTypes[eventType] || "Wedding";
  };

  // Sample photo album data
  const photoAlbum = [
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
  ];

  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 text-center">
                {event.name}
              </h1>
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 ease-in-out transform hover:scale-110 active:scale-95 ${
                  showDropdown ? "bg-gray-100 scale-110" : ""
                }`}
                aria-label="More options"
              >
                <MoreVertical
                  className={`w-5 h-5 transition-transform duration-200 ${
                    showDropdown ? "rotate-90" : ""
                  }`}
                />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-20 transform transition-all duration-200 ease-out animate-in fade-in slide-in-from-top-2">
                  <div className="py-1">
                    <button
                      onClick={handleEditClick}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-all duration-150 ease-in-out hover:translate-x-1 group"
                    >
                      <Edit3 className="w-4 h-4 transition-transform duration-150 group-hover:scale-110" />
                      Edit Event
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-all duration-150 ease-in-out hover:translate-x-1 group"
                    >
                      <Trash2 className="w-4 h-4 transition-transform duration-150 group-hover:scale-110" />
                      Delete Event
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Image */}
        <div className="relative mb-12 animate-on-scroll">
          <div className="relative h-80 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl overflow-hidden">
            <img
              src={event.image || "/placeholder.svg?height=320&width=800"}
              alt={event.name}
              className="w-full h-full object-cover"
            />
            {/* Decorative wavy lines overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Decorative wavy lines below image */}
          <div className="mt-4 space-y-2">
            <div className="h-0.5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full opacity-50"></div>
          </div>
        </div>

        {/* Event Details Section */}
        <div className="mb-12 animate-on-scroll delay-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Event Details
          </h2>

          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(event.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Venue</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {event.venue}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Event Type</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {getEventTypeLabel(event.eventType)}
                  </p>
                </div>
              </div>
            </div>

            {event.details && (
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">{event.details}</p>
              </div>
            )}

            {event.hosts && event.hosts.length > 0 && (
              <div className="pt-6 border-t border-gray-200 mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Hosts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.hosts.map((host, index) => (
                    <div key={host.id} className="bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                          <Users className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            {index === 0 ? "Bride" : "Groom"}
                          </p>
                          <p className="font-semibold text-gray-900">
                            {host.name}
                          </p>
                        </div>
                      </div>
                      {host.parentNames && host.parentNames.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Parents:</p>
                          <div className="space-y-1">
                            {host.parentNames.map(
                              (parentName, parentIndex) =>
                                parentName && (
                                  <p
                                    key={parentIndex}
                                    className="text-sm text-gray-700 bg-white rounded-lg px-3 py-1"
                                  >
                                    {parentName}
                                  </p>
                                )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Agenda Section */}
        {event.agenda && event.agenda.length > 0 && (
          <div className="mb-12 animate-on-scroll delay-300">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Agenda
            </h2>

            <div className="space-y-6">
              {event.agenda.map((day, dayIndex) => {
                const { day: dayNumber, month } = formatAgendaDate(day.date);
                return (
                  <div
                    key={day.id}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border border-blue-200"
                  >
                    {/* Custom Date and Location Header */}
                    <div className="flex flex-col sm:flex-row sm:items-stretch gap-4 sm:gap-0 mb-6 bg-white rounded-2xl p-4 sm:p-6 border border-blue-200 shadow-sm">
                      {/* Date Display */}
                      <div className="flex items-center justify-center sm:justify-start">
                        {/* Day and Month Vertical Stack */}
                        <div className="text-center min-w-[60px]">
                          <div className="text-3xl sm:text-4xl font-bold text-blue-900 leading-none">
                            {dayNumber || String(dayIndex + 1).padStart(2, "0")}
                          </div>
                          <div className="text-xs font-bold text-blue-700 tracking-widest mt-1">
                            {month || "DAY"}
                          </div>
                        </div>

                        {/* Vertical Divider - Hidden on mobile */}
                        <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-200 mx-6"></div>

                        {/* Horizontal Divider - Visible on mobile */}
                        <div className="block sm:hidden w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent my-3"></div>
                      </div>

                      {/* Location and Day Info */}
                      <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
                        <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                          {event.venue || "Event Venue"}
                        </div>
                        <div className="text-sm text-gray-600 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Day {dayIndex + 1}
                          </span>
                          {day.date && (
                            <span className="text-gray-500 text-xs sm:text-sm">
                              {formatDate(day.date)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {day.activities &&
                        day.activities.map(
                          (activity) =>
                            activity.time &&
                            activity.activity && (
                              <div
                                key={activity.id}
                                className="bg-white rounded-2xl p-4 border border-blue-100"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold min-w-fit">
                                    {formatTime(activity.time)}
                                  </div>
                                  <p className="text-gray-800 font-medium">
                                    {activity.activity}
                                  </p>
                                </div>
                              </div>
                            )
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Photo Album Section */}
        <div className="mb-12 animate-on-scroll delay-400">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Photo Gallary
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photoAlbum.map((photo, index) => (
              <div
                key={index}
                className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <img
                  src={photo}
                  alt={`Event photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Section */}
        {event.youtubeUrl && getYouTubeVideoId(event.youtubeUrl) && (
          <div className="mb-12 animate-on-scroll delay-500">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Event Video
            </h2>

            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-lg">
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                    event.youtubeUrl
                  )}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  title="Event Video"
                  className="absolute inset-0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Map Section */}
        {event.googleMapLink && (
          <div className="mb-12 animate-on-scroll delay-600">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Location</h2>

            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-lg">
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(
                    event.venue
                  )}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Event Location"
                  className="absolute inset-0"
                />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-semibold text-gray-900">{event.venue}</p>
                  {event.googleMapLink && (
                    <a
                      href={event.googleMapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
                    >
                      Open in Google Maps
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmationModal.isOpen && (
        <>
          <style jsx>{`
            @keyframes modalSlideIn {
              from {
                opacity: 0;
                transform: scale(0.9) translateY(20px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }

            @keyframes modalSlideOut {
              from {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
              to {
                opacity: 0;
                transform: scale(0.9) translateY(20px);
              }
            }

            @keyframes backdropFadeIn {
              from {
                opacity: 0;
                backdrop-filter: blur(0px);
              }
              to {
                opacity: 1;
                backdrop-filter: blur(8px);
              }
            }

            @keyframes backdropFadeOut {
              from {
                opacity: 1;
                backdrop-filter: blur(8px);
              }
              to {
                opacity: 0;
                backdrop-filter: blur(0px);
              }
            }

            @keyframes iconPulse {
              0%,
              100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.05);
              }
            }

            .modal-enter {
              animation: modalSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            .modal-exit {
              animation: modalSlideOut 0.2s
                cubic-bezier(0.55, 0.055, 0.675, 0.19);
            }

            .backdrop-enter {
              animation: backdropFadeIn 0.3s ease-out;
            }

            .backdrop-exit {
              animation: backdropFadeOut 0.2s ease-in;
            }

            .icon-animate {
              animation: iconPulse 2s infinite ease-in-out;
            }
          `}</style>
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
              className={`fixed inset-0 bg-black/50 transition-all duration-300 ${
                confirmationModal.isAnimating
                  ? "backdrop-enter"
                  : "backdrop-exit"
              }`}
              onClick={closeConfirmation}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
              <div
                className={`relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-auto transition-all duration-300 ${
                  confirmationModal.isAnimating ? "modal-enter" : "modal-exit"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  onClick={closeConfirmation}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 hover:rotate-90"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="p-8">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6 icon-animate">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                    {confirmationModal.title}
                  </h3>

                  {/* Message */}
                  <p className="text-gray-600 text-center mb-8 leading-relaxed">
                    {confirmationModal.message}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={closeConfirmation}
                      className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:shadow-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="flex-1 px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-2xl font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
