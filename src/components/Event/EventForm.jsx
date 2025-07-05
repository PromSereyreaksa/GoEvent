import { useState, useEffect, useCallback, useRef } from "react";
import {
  ArrowLeft,
  Save,
  X,
  Upload,
  ImageIcon,
  Youtube,
  Plus,
  Minus,
  MapPin,
  Calendar,
  Clock,
  MoreVertical,
  Edit3,
  Trash2,
  AlertTriangle,
} from "lucide-react";

export function EventForm({
  formData,
  onInputChange,
  onFileUpload,
  onSave,
  onCancel,
  isEdit = false,
}) {
  const eventTypes = [{ value: "wedding", label: "Wedding", hostCount: 2 }];

  // Confirmation modal state
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    isAnimating: false,
  });

  // Show confirmation modal
  const showConfirmation = (title, message, onConfirm) => {
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      isAnimating: true,
    });
  };

  // Close confirmation modal
  const closeConfirmation = () => {
    setConfirmationModal((prev) => ({ ...prev, isAnimating: false }));
    setTimeout(() => {
      setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
    }, 200);
  };

  // Handle confirmation
  const handleConfirm = () => {
    if (confirmationModal.onConfirm) {
      confirmationModal.onConfirm();
    }
    closeConfirmation();
  };
  const getYouTubeVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getSelectedEventType = () => {
    const selectedType = eventTypes.find(
      (type) => type.value === formData.eventType
    );
    return selectedType || { hostCount: 1 };
  };

  const handleEventTypeChange = (e) => {
    onInputChange(e);
  };

  const addHostField = () => {
    const currentHosts = formData.hosts || [];
    const newHost = {
      id: Date.now(),
      name: "",
      parentNames: [""],
    };
    onInputChange({
      target: {
        name: "hosts",
        value: [...currentHosts, newHost],
      },
    });
  };

  const removeHostField = (hostId) => {
    const updatedHosts = formData.hosts.filter((host) => host.id !== hostId);
    onInputChange({
      target: {
        name: "hosts",
        value: updatedHosts,
      },
    });
  };

  const updateHost = (hostId, field, value) => {
    const updatedHosts = formData.hosts.map((host) =>
      host.id === hostId ? { ...host, [field]: value } : host
    );
    onInputChange({
      target: {
        name: "hosts",
        value: updatedHosts,
      },
    });
  };

  const addParentName = (hostId) => {
    const updatedHosts = formData.hosts.map((host) =>
      host.id === hostId
        ? { ...host, parentNames: [...host.parentNames, ""] }
        : host
    );
    onInputChange({
      target: {
        name: "hosts",
        value: updatedHosts,
      },
    });
  };

  const removeParentName = (hostId, parentIndex) => {
    showConfirmation(
      "Remove Parent Name",
      "Are you sure you want to remove this parent name?",
      () => {
        const updatedHosts = formData.hosts.map((host) =>
          host.id === hostId
            ? {
                ...host,
                parentNames: host.parentNames.filter(
                  (_, index) => index !== parentIndex
                ),
              }
            : host
        );
        onInputChange({
          target: {
            name: "hosts",
            value: updatedHosts,
          },
        });
      }
    );
  };

  const updateParentName = (hostId, parentIndex, value) => {
    const updatedHosts = formData.hosts.map((host) =>
      host.id === hostId
        ? {
            ...host,
            parentNames: host.parentNames.map((name, index) =>
              index === parentIndex ? value : name
            ),
          }
        : host
    );
    onInputChange({
      target: {
        name: "hosts",
        value: updatedHosts,
      },
    });
  };

  // Agenda Management Functions
  const addAgendaDay = () => {
    const currentAgenda = formData.agenda || [];
    const newDay = {
      id: Date.now(),
      date: "",
      title: "",
      activities: [{ id: Date.now() + 1, time: "", activity: "" }],
    };
    onInputChange({
      target: {
        name: "agenda",
        value: [...currentAgenda, newDay],
      },
    });
  };

  const removeAgendaDay = (dayId) => {
    showConfirmation(
      "Delete Agenda Day",
      "Are you sure you want to delete this agenda day? This action cannot be undone.",
      () => {
        const updatedAgenda = formData.agenda.filter((day) => day.id !== dayId);
        onInputChange({
          target: {
            name: "agenda",
            value: updatedAgenda,
          },
        });
      }
    );
  };

  const updateAgendaDay = (dayId, field, value) => {
    const updatedAgenda = formData.agenda.map((day) =>
      day.id === dayId ? { ...day, [field]: value } : day
    );
    onInputChange({
      target: {
        name: "agenda",
        value: updatedAgenda,
      },
    });
  };

  const addActivity = (dayId) => {
    const updatedAgenda = formData.agenda.map((day) =>
      day.id === dayId
        ? {
            ...day,
            activities: [
              ...day.activities,
              { id: Date.now(), time: "", activity: "" },
            ],
          }
        : day
    );
    onInputChange({
      target: {
        name: "agenda",
        value: updatedAgenda,
      },
    });
  };

  const removeActivity = (dayId, activityId) => {
    showConfirmation(
      "Delete Activity",
      "Are you sure you want to delete this activity? This action cannot be undone.",
      () => {
        const updatedAgenda = formData.agenda.map((day) =>
          day.id === dayId
            ? {
                ...day,
                activities: day.activities.filter(
                  (activity) => activity.id !== activityId
                ),
              }
            : day
        );
        onInputChange({
          target: {
            name: "agenda",
            value: updatedAgenda,
          },
        });
      }
    );
  };

  const updateActivity = (dayId, activityId, field, value) => {
    const updatedAgenda = formData.agenda.map((day) =>
      day.id === dayId
        ? {
            ...day,
            activities: day.activities.map((activity) =>
              activity.id === activityId
                ? { ...activity, [field]: value }
                : activity
            ),
          }
        : day
    );
    onInputChange({
      target: {
        name: "agenda",
        value: updatedAgenda,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-12">
        <button
          onClick={onCancel}
          className="p-3 text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
          aria-label="Go back to events list"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[120%] tracking-[-1.5px] sm:tracking-[-2.5px] text-gray-900 mb-2">
            {isEdit ? "Edit Event" : "Create New Event"}
          </h2>
          <p className="text-lg text-gray-600">
            Fill in the information below to {isEdit ? "update" : "create"} your
            event
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
        className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Event Type */}
          <div className="md:col-span-2">
            <label
              htmlFor="eventType"
              className="block text-black font-bold mb-4 text-lg"
            >
              Event Type *
            </label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType || ""}
              onChange={handleEventTypeChange}
              className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 font-medium"
              required
            >
              <option value="">Select Event Type</option>
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Event Image Upload - Only show in edit mode */}
          {isEdit && (
            <div className="md:col-span-2">
              <label className="block text-black font-bold mb-4 text-lg">
                Event Image
              </label>
              <div className="relative">
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={formData.image || "/placeholder.svg"}
                      alt="Event preview"
                      className="w-full h-48 object-cover rounded-3xl border border-gray-200 shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        onInputChange({ target: { name: "image", value: "" } })
                      }
                      className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors shadow-lg"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-blue-400 transition-colors bg-gradient-to-br from-gray-50 to-white">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <ImageIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-gray-600 mb-6 font-medium">
                      Upload an event image
                    </p>
                    <label className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer inline-flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onFileUpload(e, "image")}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Event Name */}
          <div className="md:col-span-2">
            <label
              htmlFor="name"
              className="block text-black font-bold mb-4 text-lg"
            >
              Event Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={onInputChange}
              placeholder="Enter event name"
              className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 font-medium"
              required
            />
          </div>

          {/* Event Details - Only show in edit mode */}
          {isEdit && (
            <div className="md:col-span-2">
              <label
                htmlFor="details"
                className="block text-black font-bold mb-4 text-lg"
              >
                Event Details
              </label>
              <textarea
                id="details"
                name="details"
                value={formData.details || ""}
                onChange={onInputChange}
                placeholder="Describe your event in detail..."
                rows="4"
                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors resize-none bg-gray-50 font-medium"
              />
            </div>
          )}

          {/* Agenda - Only show in edit mode */}
          {isEdit && (
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-black font-bold text-lg">
                  Wedding Agenda
                </label>
                <button
                  type="button"
                  onClick={addAgendaDay}
                  className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Day
                </button>
              </div>

              {formData.agenda && formData.agenda.length > 0 ? (
                <div className="space-y-6">
                  {formData.agenda.map((day, dayIndex) => (
                    <div
                      key={day.id}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Day {dayIndex + 1}
                        </h4>
                        {formData.agenda.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAgendaDay(day.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      {/* Day Date */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-blue-700 font-medium mb-2">
                            Date
                          </label>
                          <input
                            type="date"
                            value={day.date || ""}
                            onChange={(e) =>
                              updateAgendaDay(day.id, "date", e.target.value)
                            }
                            className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:border-blue-500 focus:outline-none transition-colors bg-white font-medium"
                          />
                        </div>
                        {/* <div>
                          <label className="block text-blue-700 font-medium mb-2">
                            Day Title
                          </label>
                          <input
                            type="text"
                            value={day.title || ""}
                            onChange={(e) =>
                              updateAgendaDay(day.id, "title", e.target.value)
                            }
                            placeholder="e.g., Wedding Ceremony, Reception, Pre-wedding"
                            className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:border-blue-500 focus:outline-none transition-colors bg-white font-medium"
                          />
                        </div> */}
                      </div>

                      {/* Activities */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                          <label className="block text-blue-700 font-medium">
                            Activities & Schedule
                          </label>
                          {/* Desktop Add Activity Button */}
                          <button
                            type="button"
                            onClick={() => addActivity(day.id)}
                            className="hidden sm:inline-flex text-blue-600 hover:text-blue-800 transition-colors text-sm items-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            Add Activity
                          </button>
                        </div>

                        <div className="space-y-3">
                          {day.activities.map((activity, activityIndex) => (
                            <div
                              key={activity.id}
                              className="bg-white rounded-xl p-4 border border-blue-100"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                    <input
                                      type="time"
                                      value={activity.time || ""}
                                      onChange={(e) =>
                                        updateActivity(
                                          day.id,
                                          activity.id,
                                          "time",
                                          e.target.value
                                        )
                                      }
                                      className="w-full sm:w-auto px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 font-medium text-sm"
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    value={activity.activity || ""}
                                    onChange={(e) =>
                                      updateActivity(
                                        day.id,
                                        activity.id,
                                        "activity",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Describe the activity..."
                                    className="flex-1 w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 font-medium text-sm"
                                  />
                                </div>
                                {day.activities.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeActivity(day.id, activity.id)
                                    }
                                    className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0 self-start sm:self-center"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Mobile Add Activity Button - Bottom */}
                        <div className="sm:hidden mt-3">
                          <button
                            type="button"
                            onClick={() => addActivity(day.id)}
                            className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Activity
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center border border-blue-200">
                  <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <p className="text-blue-600 mb-4">No agenda days added yet</p>
                  <button
                    type="button"
                    onClick={addAgendaDay}
                    className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Day
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Venue Name - Only show in edit mode */}
          {isEdit && (
            <div className="md:col-span-2">
              <label
                htmlFor="venue"
                className="block text-black font-bold mb-4 text-lg"
              >
                Venue Name *
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={onInputChange}
                placeholder="Enter venue name"
                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 font-medium"
                required
              />
            </div>
          )}

          {/* Host Information - Only show in edit mode */}
          {isEdit && (
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-black font-bold text-lg">
                  Host Information * (Bride & Groom)
                </label>
              </div>

              {formData.hosts && formData.hosts.length > 0 ? (
                <div className="space-y-6">
                  {formData.hosts.map((host, hostIndex) => (
                    <div
                      key={host.id}
                      className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {hostIndex === 0 ? "Bride" : "Groom"}
                        </h4>
                      </div>

                      {/* Host Name */}
                      <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                          {hostIndex === 0 ? "Bride" : "Groom"} Name *
                        </label>
                        <input
                          type="text"
                          value={host.name}
                          onChange={(e) =>
                            updateHost(host.id, "name", e.target.value)
                          }
                          placeholder={`Enter ${
                            hostIndex === 0 ? "bride" : "groom"
                          } name`}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-white font-medium"
                          required
                        />
                      </div>

                      {/* Parent Names */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-gray-700 font-medium">
                            Parent Names
                          </label>
                          {host.parentNames.length < 2 && (
                            <button
                              type="button"
                              onClick={() => addParentName(host.id)}
                              className="text-blue-500 hover:text-blue-700 transition-colors text-sm"
                            >
                              <Plus className="w-4 h-4 inline mr-1" />
                              Add Parent
                            </button>
                          )}
                        </div>

                        {host.parentNames.map((parentName, parentIndex) => (
                          <div
                            key={parentIndex}
                            className="flex items-center gap-2 mb-2"
                          >
                            <input
                              type="text"
                              value={parentName}
                              onChange={(e) =>
                                updateParentName(
                                  host.id,
                                  parentIndex,
                                  e.target.value
                                )
                              }
                              placeholder={`Parent ${parentIndex + 1} name`}
                              className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-white font-medium"
                            />
                            {host.parentNames.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeParentName(host.id, parentIndex)
                                }
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
                  <p className="text-gray-600 mb-4">Wedding hosts required</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Please add bride and groom information
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="block text-black font-bold mb-4 text-lg"
            >
              Event Date (DD/MM/YYYY) *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date || ""}
              onChange={onInputChange}
              className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 font-medium"
              required
            />
          </div>

          {/* Start Time */}
          <div>
            <label
              htmlFor="startTime"
              className="block text-black font-bold mb-4 text-lg"
            >
              Start Time *
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime || ""}
              onChange={onInputChange}
              className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 font-medium"
              required
            />
          </div>

          {/* End Time - Only show in edit mode */}
          {isEdit && (
            <div>
              <label
                htmlFor="endTime"
                className="block text-black font-bold mb-4 text-lg"
              >
                End Time *
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={onInputChange}
                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 font-medium"
                required
              />
            </div>
          )}

          {/* Location for Maps - Only show in edit mode */}
          {isEdit && (
            <div className="md:col-span-2">
              <label
                htmlFor="googleMapLink"
                className="block text-black font-bold mb-4 text-lg"
              >
                Google Map Link
              </label>
              <input
                type="url"
                id="googleMapLink"
                name="googleMapLink"
                value={formData.googleMapLink || ""}
                onChange={onInputChange}
                placeholder="Paste Google Maps link here"
                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 font-medium"
              />
              <p className="text-sm text-gray-600 mt-3 font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Paste the Google Maps link for the venue location
              </p>
            </div>
          )}

          {/* Description - Removed as we now have Details */}

          {/* YouTube URL - Only show in edit mode */}
          {isEdit && (
            <div className="md:col-span-2">
              <label
                htmlFor="youtubeUrl"
                className="block text-black font-bold mb-4 text-lg"
              >
                YouTube Video URL
              </label>
              <input
                type="url"
                id="youtubeUrl"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={onInputChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 font-medium"
              />
            </div>
          )}
        </div>

        {/* YouTube Preview - Only show in edit mode */}
        {isEdit &&
          formData.youtubeUrl &&
          getYouTubeVideoId(formData.youtubeUrl) && (
            <div className="mt-12">
              <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                  <Youtube className="w-5 h-5 text-red-600" />
                </div>
                Video Preview
              </h3>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-200 shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                    formData.youtubeUrl
                  )}`}
                  width="100%"
                  height="315"
                  style={{ border: 0, borderRadius: "20px" }}
                  allowFullScreen
                  title="Event Video Preview"
                />
              </div>
            </div>
          )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-gray-200">
          <button
            type="submit"
            disabled={
              !formData.name ||
              !formData.date ||
              !formData.startTime ||
              !formData.eventType ||
              // Only require additional fields in edit mode
              (isEdit &&
                (!formData.venue ||
                  !formData.endTime ||
                  !formData.hosts ||
                  formData.hosts.length !== 2 ||
                  formData.hosts.some((host) => !host.name)))
            }
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Save className="w-5 h-5" />
            {isEdit ? "Update Event" : "Create Event"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Cancel
          </button>
        </div>
      </form>

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
                  <div className="w-16 h-16 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-6 icon-animate">
                    <AlertTriangle className="w-8 h-8 text-amber-600" />
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
