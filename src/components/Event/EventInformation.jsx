"use client";

import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Users,
  Heart,
  CalendarDays,
  User,
  AlertCircle,
  Info,
  CheckCircle,
} from "lucide-react";

export function EventInformation({ event, onBack }) {
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Event Not Found
          </h3>
          <p className="text-gray-600 mb-6">
            The event data could not be loaded.
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const displayEvent = event;

  return (
    <div className="min-h-screen bg-gray-50 font-['Plus_Jakarta_Sans'] w-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm w-full">
        <div className="px-4 sm:px-6 lg:px-8 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {displayEvent?.name || displayEvent?.title || "Event Details"}
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage event details and settings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Event Image */}
        {(displayEvent?.image || displayEvent?.event_banner) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <img
              src={displayEvent.image || displayEvent.event_banner}
              alt={displayEvent?.name || displayEvent?.title || "Event"}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover"
            />
          </div>
        )}

        {/* Core Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-600" />
              Event Details
            </h2>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
              <CheckCircle className="w-4 h-4" />
              Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Date */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <p className="text-gray-900 font-medium">
                  {displayEvent?.date || "Not set"}
                </p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <p className="text-gray-900 font-medium">
                  {displayEvent?.startTime || displayEvent?.start_time || "N/A"}{" "}
                  - {displayEvent?.endTime || displayEvent?.end_time || "N/A"}
                </p>
              </div>
            </div>

            {/* Venue */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venue
                </label>
                <p className="text-gray-900 font-medium">
                  {displayEvent?.venue || displayEvent?.venue_name || "Not set"}
                </p>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <p className="text-gray-900 font-medium">
                  {displayEvent?.category || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {displayEvent?.details ||
                displayEvent?.description ||
                "No description available."}
            </p>
          </div>
        </div>

        {/* Hosts Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Event Hosts
            </h2>
          </div>

          {displayEvent?.hosts?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayEvent.hosts.map((host, index) => (
                <div
                  key={host?.id || index}
                  className="bg-gray-50 rounded-lg p-6 border border-gray-200 relative"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {host?.name || "Unnamed Host"}
                      </h3>
                      {host?.parentNames?.length > 0 && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Parents:</span>{" "}
                          {host.parentNames.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hosts added yet
              </h3>
              <p className="text-gray-600 mb-4">
                Add team members to manage this event
              </p>
            </div>
          )}
        </div>

        {/* Agenda Card */}
        {displayEvent?.agenda?.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-blue-600" />
              Event Agenda
            </h2>
            <div className="space-y-6">
              {displayEvent.agenda.map((day, index) => (
                <div
                  key={day?.id || index}
                  className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    {day?.title || `Day ${index + 1}`}
                    {day?.date && (
                      <span className="text-sm font-normal text-gray-600 ml-2">
                        ({day.date})
                      </span>
                    )}
                  </h3>
                  <div className="space-y-3">
                    {day?.activities?.length > 0 ? (
                      day.activities.map((activity, actIndex) => (
                        <div
                          key={activity?.id || actIndex}
                          className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200"
                        >
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {activity?.time || "Time TBD"}
                              </span>
                            </div>
                            <p className="text-gray-700">
                              {activity?.activity || "No activity description."}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 italic">
                        No activities listed for this day.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
