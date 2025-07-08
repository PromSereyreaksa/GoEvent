"use client"

import { Calendar, MapPin } from "lucide-react"

export default function EventCard({ event, onView }) {
  const formatDateForCard = (dateString) => {
    if (!dateString) return { day: "??", month: "TBD" }
    const date = new Date(dateString)
    return {
      day: date.getDate().toString(),
      month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
    }
  }

  return (
    <div 
      onClick={onView}
      className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
    >
      {/* Event Banner */}
      {event.event_banner ? (
        <img src={event.event_banner || "/placeholder.svg"} alt={event.title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <Calendar className="w-16 h-16 text-white opacity-50" />
        </div>
      )}

      <div className="p-6">
        {/* Event Type Tag and Status */}
        <div className="flex items-center justify-between mb-4">
          {event.category && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full uppercase tracking-wide">
              {event.category}
            </span>
          )}
          
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            event.is_published 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {event.is_published ? 'Published' : 'Inactive'}
          </span>
        </div>

        {/* Date and Title/Location */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center bg-gradient-to-b from-blue-600 via-blue-400 to-blue-200 rounded-lg p-3 min-w-[60px] shadow-sm">
            <span className="text-2xl font-bold text-white">{formatDateForCard(event.date).day}</span>
            <span className="text-xs font-semibold text-white uppercase tracking-wide">{formatDateForCard(event.date).month}</span>
          </div>
          
          {/* Title and Location Stacked */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 mb-1">{event.title}</h3>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{event.venue_name || "Location TBD"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
