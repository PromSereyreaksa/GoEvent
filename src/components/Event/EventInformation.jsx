"use client"

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
} from "lucide-react"

export function EventInformation({ event, onBack }) {
  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-6 font-['Plus_Jakarta_Sans']">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200/60 p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">The event data could not be loaded. Please try again.</p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const displayEvent = event

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 font-['Plus_Jakarta_Sans'] w-full">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm w-full">
        <div className="px-4 sm:px-6 lg:px-8 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-3 rounded-2xl hover:bg-gray-100/80 transition-all duration-200 transform hover:scale-105 backdrop-blur-sm"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                  {displayEvent?.name || displayEvent?.title || "Event Details"}
                </h1>
                <p className="text-gray-600 mt-1 font-medium">Comprehensive event information and details</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Event Image */}
        {(displayEvent?.image || displayEvent?.event_banner) && (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200/60 overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
            <img
              src={displayEvent.image || displayEvent.event_banner}
              alt={displayEvent?.name || displayEvent?.title || "Event"}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover"
            />
          </div>
        )}

        {/* Core Details Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200/60 p-6 sm:p-8 transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center">
                <Info className="w-5 h-5 text-white" />
              </div>
              Event Details
            </h2>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200/60 backdrop-blur-sm">
              <CheckCircle className="w-4 h-4" />
              Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Date */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/60 backdrop-blur-sm transform hover:scale-105 transition-all duration-200">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                <p className="text-gray-900 font-bold">{displayEvent?.date || "Not set"}</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/60 backdrop-blur-sm transform hover:scale-105 transition-all duration-200">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
                <p className="text-gray-900 font-bold">
                  {displayEvent?.startTime || displayEvent?.start_time || "N/A"} -{" "}
                  {displayEvent?.endTime || displayEvent?.end_time || "N/A"}
                </p>
              </div>
            </div>

            {/* Venue */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/60 backdrop-blur-sm transform hover:scale-105 transition-all duration-200">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Venue</label>
                <p className="text-gray-900 font-bold">
                  {displayEvent?.venue || displayEvent?.venue_name || "Not set"}
                </p>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100/50 border border-pink-200/60 backdrop-blur-sm transform hover:scale-105 transition-all duration-200">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-pink-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <p className="text-gray-900 font-bold">{displayEvent?.category || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200/60 p-6 sm:p-8 transform hover:scale-[1.01] transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
            Description
          </h2>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200/60 backdrop-blur-sm">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed font-medium">
              {displayEvent?.details || displayEvent?.description || "No description available."}
            </p>
          </div>
        </div>

        {/* Hosts Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200/60 p-6 sm:p-8 transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              Event Hosts
            </h2>
          </div>

          {displayEvent?.hosts?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayEvent.hosts.map((host, index) => (
                <div
                  key={host?.id || index}
                  className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200/60 backdrop-blur-sm transform hover:scale-105 transition-all duration-200 relative"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{host?.name || "Unnamed Host"}</h3>
                      {host?.parentNames?.length > 0 && (
                        <p className="text-sm text-gray-600 font-medium">
                          <span className="font-semibold">Parents:</span> {host.parentNames.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200/60 backdrop-blur-sm">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No hosts added yet</h3>
              <p className="text-gray-600 mb-6 font-medium">Add team members to manage this event</p>
            </div>
          )}
        </div>

        {/* Agenda Card */}
        {displayEvent?.agenda?.length > 0 && (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200/60 p-6 sm:p-8 transform hover:scale-[1.01] transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              Event Agenda
            </h2>
            <div className="space-y-8">
              {displayEvent.agenda.map((day, index) => (
                <div
                  key={day?.id || index}
                  className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200/60 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {index + 1}
                    </div>
                    {day?.title || `Day ${index + 1}`}
                    {day?.date && (
                      <span className="text-sm font-medium text-gray-600 ml-2 px-3 py-1 bg-white/60 rounded-xl border border-gray-200/60">
                        ({day.date})
                      </span>
                    )}
                  </h3>
                  <div className="space-y-4">
                    {day?.activities?.length > 0 ? (
                      day.activities.map((activity, actIndex) => (
                        <div
                          key={activity?.id || actIndex}
                          className="flex items-start gap-4 p-4 bg-white/60 rounded-2xl border border-gray-200/60 backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-200"
                        >
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-5 h-5 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                <Clock className="w-3 h-3 text-gray-500" />
                              </div>
                              <span className="text-sm font-bold text-gray-900">{activity?.time || "Time TBD"}</span>
                            </div>
                            <p className="text-gray-700 font-medium leading-relaxed">
                              {activity?.activity || "No activity description."}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 italic font-medium text-center py-4">
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
  )
}
