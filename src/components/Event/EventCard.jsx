"use client"

import { Calendar, MapPin, Users, Edit, Trash2, Eye } from "lucide-react"

export default function EventCard({ event, onEdit, onDelete, onView, canEdit = false, canDelete = false }) {
  const formatDate = (dateString) => {
    if (!dateString) return "Date TBD"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return ""
    const [hours, minutes] = timeString.split(":")
    const date = new Date()
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Event Banner */}
      {event.event_banner ? (
        <img src={event.event_banner || "/placeholder.svg"} alt={event.title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <Calendar className="w-16 h-16 text-white opacity-50" />
        </div>
      )}

      <div className="p-6">
        {/* Event Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>

        {/* Event Description */}
        {event.description && <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>}

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          {event.date && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(event.date)}</span>
              {event.start_time && <span className="text-gray-400">• {formatTime(event.start_time)}</span>}
            </div>
          )}

          {event.venue_name && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{event.venue_name}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{event.guest_count || 0} guests</span>
          </div>
        </div>

        {/* Category Badge */}
        {event.category && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
              {event.category}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </button>

          {canEdit && (
            <button
              onClick={onEdit}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}

          {canDelete && (
            <button
              onClick={onDelete}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>

        {/* Non-vendor message */}
        {!canEdit && !canDelete && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            Vendor access required to edit or delete events
          </div>
        )}
      </div>
    </div>
  )
}
